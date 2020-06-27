const { Schema, model } = require('mongoose');
const { emailRegex } = require('helpers');

const UserSchema = new Schema({
  id: Schema.Types.ObjectId,
  clientId: Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    validate: {
      validator: value => {
        return emailRegex.test(value)
      }
    }
  },
  name: {
    type: String, 
    required: true
  }
});

const User = model('User', UserSchema);

module.exports = User;