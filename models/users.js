const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  articles:{
  	type:[String]
  },
  access:{
  	type:String
  },
  following: {
  	type:[String]
  }
})
module.exports = mongoose.model('users', userSchema);
