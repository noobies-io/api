const dynamoose = require('dynamoose')
dynamoose.setDefaults({ create: false });

let UserSchema = new dynamoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  birthday: String,
  studyPlace: String,
  studySubject: String,
})

let User = dynamoose.model('Users', UserSchema)
module.exports = User