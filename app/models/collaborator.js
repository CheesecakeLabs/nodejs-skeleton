var mongoose = require('mongoose'),

var schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  photo_url: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    unique: false,
  }
});

var Model = mongoose.model('Collaborator', schema);

module.exports = Model;
