const dynamoose = require('dynamoose')
dynamoose.setDefaults({ create: false });

let RegisterSchema = new dynamoose.Schema({
  email: String,
  password: String,
  token: String,
})

let Register = dynamoose.model('Registers', RegisterSchema)
module.exports = Register