const jwt = require('jsonwebtoken')
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
      unique: true
  },
  password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024
  },
  isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({ _id: this._id, name: this.name, email: this.email, isAdmin: this.isAdmin }, 'project_jwtPrivetKey')
  return token
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(100).required().email(),
    password: Joi.string().min(3).max(255).required()
  };

  return Joi.validate(user, schema);
}

exports.User = User; 
exports.validate = validateUser;