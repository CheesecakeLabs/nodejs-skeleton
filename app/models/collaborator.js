var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var collaboratorSchema = new Schema({
  name: String,
  photo_url: String,
  description: String
});

var Collaborator = mongoose.model('Collaborator', collaboratorSchema);
