const fastifyPlugin = require('fastify-plugin')
const dynamoose = require('dynamoose');

async function startDbConnection (fastify) {
  dynamoose.AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.DYNAMODB_REGION,
  })

  fastify.decorate('dynamoose', dynamoose)
}

module.exports = fastifyPlugin(startDbConnection)