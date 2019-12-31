const program = require('commander');
program
  .option('--debug', 'output extra debugging')
  .option('--api-debug', 'log api requests')
  .option('--no-alive', "don't output alive messages")
  .option('--mongo <connection-string>', 'connection string for mongodb', process.env.LITELOG_MONGO ? process.env.LITELOG_MONGO : 'mongodb://localhost:27017/litelogs')
  .option('--port <port-number>', 'port number to listen on', process.env.LITELOG_PORT ? process.env.LITELOG_PORT : 12201)
  .option('--ip <ip-address>', 'IP address to bind to', process.env.LITELOG_IP ? process.env.LITELOG_IP : '0.0.0.0')
  .option('--ttl <hours>', 'number of hours to retain logs', process.env.LITELOG_TTL ? process.env.LITELOG_TTL : 0.1)
  .option('--user <username>', 'username for mongodb', process.env.LITELOG_USER ? process.env.LITELOG_USER : '')
  .option('--password <password>', 'password for mongodb', process.env.LITELOG_PASSWORD ? process.env.LITELOG_PASSWORD : '')
  .option('--forward <gelf-server>', 'forward messages to this server', process.env.LITELOG_FORWARD ? process.env.LITELOG_FORWARD : '')
  .option('--api-port <port-number>', 'port for the api server', process.env.LITELOG_API_PORT ? process.env.LITELOG_API_PORT : 3001)
  .option('--api-key <string>', 'The api key to use', process.env.LITELOG_API_KEY ? process.env.LITELOG_API_KEY : Math.random().toString(36).substring(30))
  .option('--max-results <number', 'Maximum number of results to return in one query', process.env.LITELOG_MAX_RESULTS ? process.env.LITELOG_MAX_RESULTS : 100)
program.parse(process.argv);

module.exports = program;
