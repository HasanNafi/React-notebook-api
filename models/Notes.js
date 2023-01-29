const mongoose = require('mongoose');

const { Schema } = mongoose;

const NotesSchema = new Schema({
  title:{
    type:String,
    required: true
  },
  description:{
    type:email,
    required: true
  },
  tag:{
    type:String,
    default:"General"
  },
  date:{
    type:date,
    default: Date.now
  },
});

module.exports = mongoose.model('notes',NotesSchema);