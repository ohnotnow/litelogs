// create our GELF server
const program = require('./opts.js');
const gelfserver = require('graygelf/server')
const pickBy = require('lodash/pickBy');
const Log = require('./schema.js');
const server = gelfserver()
if (program.forward) {
  const client = require('graygelf')(program.forward);
  server.pipe(client);
}

server.on('message', function (gelf) {
  // extract any object keys that begin with '_' (additional custom gelf lines)
  let tags = pickBy(gelf, (k,v) => {
    return v.startsWith('_');
  });
  let logEntry = new Log({
    host: gelf.host,
    short_message: gelf.short_message,
    full_message: gelf.full_message ? gelf.full_message : '',
    combined_message: `${gelf.short_message} ${gelf.full_message ? gelf.full_message : ''} ${Object.values(tags).join(" ")}`,
    timestamp: gelf.timestamp,
    level: gelf.level,
    tags: tags
  });
  logEntry.save().then(() => {if (program.debug) { console.log(`Saved: ${logEntry}`); }});
});
server.on('error', function (gelf) {
  console.log('error');
});

module.exports = server;
