const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const pickBy = require('lodash/pickBy');
const gelfserver = require('graygelf/server')
const program = require('commander');

// make sure we exit properly when recieving signals
process.on("SIGINT", function() {
  console.log('CLOSING [SIGINT]');
  process.exit();
});
process.on("SIGTERM", function() {
  console.log('CLOSING [SIGTERM]');
  process.exit();
});

// parse our commandline options, taking defaults from ENV variables if set
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

// connect to mongodb
const mongoOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
if (program.user) {
  mongoOpts['user'] = program.user;
}
if (program.password) {
  mongoOpts['password'] = program.password;
}
mongoose.connect(program.mongo, mongoOpts).catch(err => {
  console.error('Failed to connect to mongodb : ' + err);
});
mongoose.connection.on('error', err => {
  console.error('Mongodb error : ' + err);
});
const logSchema = new mongoose.Schema({
   created_at: { type: Date, default: Date.now, expires: parseFloat(program.ttl) * 60 * 60 },
   host: String,
   short_message: String,
   full_message: String,
   combined_message: { type: String, index: true },
   timestamp: Number,
   level: Number,
   tags: Object,
});
logSchema.plugin(mongoosePaginate);
const Log = mongoose.model('Logs', logSchema);

// create our GELF server
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

// spit out our gelf server starting message
const opts = program.opts();
if (opts.password) {
  opts.password = '*****';
}
const safeOpts = JSON.stringify(opts);
console.log(`Starting litelog with options: ${safeOpts}`);
server.listen(program.port)
if (!program.noAlive) {
  setInterval(() => console.log('Alive...'), 60000);
}

// set up express for the http api
const app = express()
app.use(cors());

if (program.debug || program.apiDebug) {
  const morgan = require('morgan');
  app.use(morgan('combined'));
}
checkApiKey = function (req, res, next) {
  if (!req.headers['x-auth'] || req.headers['x-auth'] !== program.apiKey) {
    res.status(401);
    res.end();
    return;
  }
  next()
};
app.get('/', checkApiKey, (req, res) => res.send(''));
app.get('/search', checkApiKey, (req, res) => {
  const pageNumber = req.query.page ? req.query.page : 1;
  const r = new RegExp(req.query.q);
  const query = {"combined_message" : { $regex : r, $options: 'i'}};
  if (req.query.container) {
    query['tags._container_name'] = { $regex: new RegExp(req.query.container), $options: 'i' };
  }
  if (req.query.image) {
    query['tags._image_name'] = { $regex: new RegExp(req.query.image), $options: 'i' };
  }
  Log.paginate(
    query,
    {page: pageNumber, limit: program.maxResults, sort: { created_at : 'desc' }},
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500);
        res.send(err);
        return;
      }
      res.send(results);
    });
});
app.get('/_healthz', (req, res) => {
  res.send('OK');
});

app.listen(program.apiPort, program.ip, () => console.log(`API listening on port ${program.apiPort}`))
