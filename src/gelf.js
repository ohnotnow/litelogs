// create our GELF server
const program = require("./opts.js");
const gelfserver = require("graygelf/server");
const pickBy = require("lodash/pickBy");
const Log = require("./schema.js");
const stats = require("./stats.js");

const server = gelfserver();
if (program.forward) {
  const client = require("graygelf")(program.forward);
  server.pipe(client);
}

server.on("message", function(gelf) {
  // extract any object keys that begin with '_' (additional custom gelf lines)
  let tags = pickBy(gelf, (k, v) => {
    return v.startsWith("_");
  });
  let logEntry = new Log({
    host: gelf.host,
    short_message: gelf.short_message,
    full_message: gelf.full_message ? gelf.full_message : "",
    combined_message: `${gelf.short_message} ${
      gelf.full_message ? gelf.full_message : ""
    } ${Object.values(tags).join(" ")}`,
    timestamp: gelf.timestamp,
    level: gelf.level,
    tags: tags
  });
  logEntry.save().then(() => {
    if (program.debug) {
      console.log(`Saved: ${logEntry}`);
    }
  });
  if (! program.disableMetrics) {
    stats.totalLogs.inc();
    stats.hostGauge.inc({host: logEntry.host});
    stats.containerGauge.inc({ container: logEntry.tags._container_name });
    stats.imageGauge.inc({ image: logEntry.tags._image_name }, 1);
  }
});
server.on("error", function(gelf) {
  console.log("error");
  if (! program.disableMetrics) {
    stats.totalGelfErrors.inc();
  }
});

module.exports = server;
