const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name:{
    type:String,
    required: true
  },
  email:{
    type:String,
    required: true,
    unique:true,
    index:true,
    sparse:true
  },
  password:{
    type:String,
    required: true
  },
  date:{
    type:Date,
    default:Date.now
  },
  googleId: String
});

// const user = mongoose.model('user',UserSchema);
// user.createIndexes(); //it will create indexes on the datatbase if database not exist initialy
// module.exports = user;
module.exports = mongoose.model('user',UserSchema);