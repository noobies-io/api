const dynamoose = require('dynamoose')
dynamoose.setDefaults({ create: false });

let EmailChangesSchema = new dynamoose.Schema({
  email: String,
  token: String,
})

let EmailChange = dynamoose.model('EmailChanges', EmailChangesSchema)
module.exports = EmailChange