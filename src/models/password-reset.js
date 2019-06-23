const dynamoose = require('dynamoose')
dynamoose.setDefaults({ create: false });

let PasswordResetsSchema = new dynamoose.Schema({
  email: String,
  token: String,
})

let PasswordReset = dynamoose.model('PasswordResets', PasswordResetsSchema)
module.exports = PasswordReset