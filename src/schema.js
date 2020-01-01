const program = require('./opts.js');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
   host: { type: String, index: true },
   short_message: String,
   full_message: String,
   combined_message: { type: String, index: true },
   timestamp: Number,
   level: Number,
   tags: Object,
});
logSchema.index({'tags._container_name': true});
logSchema.index({'tags._image_name': true});
logSchema.plugin(mongoosePaginate);
const Log = mongoose.model('Logs', logSchema);

module.exports = Log;
