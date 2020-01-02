// set up express for the http api
const program = require("./opts.js");
const Log = require("./schema.js");
const express = require("express");
const cors = require("cors");
const stats = require("./stats.js");
const basicAuth = require("express-basic-auth");

const app = express();
app.use(cors());

if (program.debug || program.apiDebug) {
  const morgan = require("morgan");
  app.use(morgan("combined"));
}

checkApiKey = function(req, res, next) {
  if (!req.headers["x-auth"] || req.headers["x-auth"] !== program.apiKey) {
    res.status(401);
    res.end();
    return;
  }
  next();
};

app.get("/", checkApiKey, (req, res) => res.send(""));
app.get("/search", checkApiKey, (req, res) => {
  const pageNumber = req.query.page ? req.query.page : 1;
  const r = new RegExp(decodeURIComponent(req.query.q));
  const query = { combined_message: { $regex: r, $options: "i" } };
  if (req.query.container) {
    query["tags._container_name"] = {
      $regex: new RegExp(decodeURIComponent(req.query.container)),
      $options: "i"
    };
  }
  if (req.query.image) {
    query["tags._image_name"] = {
      $regex: new RegExp(decodeURIComponent(req.query.image)),
      $options: "i"
    };
  }
  if (req.query.host) {
    query["host"] = {
      $regex: new RegExp(decodeURIComponent(req.query.host)),
      $options: "i"
    };
  }
  Log.paginate(
    query,
    {
      page: pageNumber,
      limit: program.maxApiResults,
      sort: { created_at: "desc" }
    },
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500);
        res.send(err);
        return;
      }
      res.send(results);
    }
  );
});
app.get("/_healthz", (req, res) => {
  res.send("OK");
});
if (!program.disableMetrics) {
  if (program.promUser) {
    const users = {};
    users[program.promUser] = program.promPass;
    app.get("/metrics", basicAuth({ users: users }), (req, res) => {
      res.set("Content-Type", stats.client.register.contentType);
      res.end(stats.client.register.metrics());
    });
  } else {
    app.get("/metrics", (req, res) => {
      res.set("Content-Type", stats.client.register.contentType);
      res.end(stats.client.register.metrics());
    });
  }
}

module.exports = app;
