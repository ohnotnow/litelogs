const program = require('./opts.js');
const gelfServer = require('./gelf.js');
const helpers = require('./helpers');
const api = require('./api');

helpers.setupSigHandler();
helpers.startupMessage();
helpers.logWeAreAlive();

gelfServer.listen(program.port)

api.listen(program.apiPort, program.ip, () => console.log(`API listening on port ${program.apiPort}`))
