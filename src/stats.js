// prometheus stats

const client = require("prom-client");

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics();

exports.totalLogs = new client.Counter({
  name: "total_logs",
  help: "Total number of log entries ingested since process started"
});

exports.hostGauge = new client.Gauge({
  name: "logs_per_host",
  help: "Number of logs for each host since last scrape",
  labelNames: ["host"]
});
exports.imageGauge = new client.Gauge({
  name: "logs_per_image",
  help: "Number of logs for each image since last scrape",
  labelNames: ["image"]
});
exports.containerGauge = new client.Gauge({
  name: "logs_per_container",
  help: "Number of logs for each container since last scrape",
  labelNames: ["container"]
});

exports.totalGelfErrors = new client.Counter({
  name: "total_gelf_errors",
  help: "Total number of internal gelf error messages since process started"
});

exports.client = client;
