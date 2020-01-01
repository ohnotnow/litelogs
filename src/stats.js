// prometheus stats

const client = require("prom-client");

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics();

exports.totalLogs = new client.Counter({
  name: "total_logs",
  help: "Total number of log entries ingested since process started"
});

exports.hostHistogram = new client.Histogram({
  name: "logs_per_host",
  help: "Number of logs for each host since process started",
  buckets: [0.1, 5, 15, 50, 100, 500],
  labelNames: ["host"]
});
exports.containerHistogram = new client.Histogram({
  name: "logs_per_container",
  help: "Number of logs for each container since process started",
  buckets: [0.1, 5, 15, 50, 100, 500],
  labelNames: ["container"]
});
exports.imageHistogram = new client.Histogram({
  name: "logs_per_image",
  help: "Number of logs for each image since process started",
  buckets: [0.1, 5, 15, 50, 100, 500],
  labelNames: ["image"]
});

exports.totalGelfErrors = new client.Counter({
  name: "total_gelf_errors",
  help: "Total number of internal gelf error messages since process started"
});

exports.client = client;
