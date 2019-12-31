exports.setupSigHandler = () => {
  process.on("SIGINT", function() {
    console.log("CLOSING [SIGINT]");
    process.exit();
  });
  process.on("SIGTERM", function() {
    console.log("CLOSING [SIGTERM]");
    process.exit();
  });
};

exports.startupMessage = () => {
  const program = require("./opts.js");
  const opts = program.opts();
  if (opts.password) {
    opts.password = "*****";
  }
  console.log(`Starting litelog with options: ${JSON.stringify(opts)}`);
};

exports.logWeAreAlive = () => {
  const program = require("./opts.js");
  if (!program.noAlive) {
    setInterval(() => console.log("Alive..."), 60000);
  }
};
