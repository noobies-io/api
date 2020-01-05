// Get environment variables
require('dotenv').config()

// Require the framework and instantiate it
const fastify = require('fastify')({ logger: false })

// Register our DynamoDB interface - DISABLED FOR MVP
// fastify.register(require('./services/database'))

// Register CORS handler
fastify.register(require('fastify-cors'), {
  // put your options here
  credentials: true,
  origin: ['http://localhost:8080', 'https://noobies.io']
})

fastify.register(require('fastify-cookie'))

// Routes handled in different JSs
const positions = require('./routes/positions')
// const auth = require('./routes/auth') - DISABLED FOR MVP

// Register route handlers
// fastify.register(auth, { prefix: '/auth' }) - DISABLED FOR MVP
fastify.register(positions, { prefix: '/positions' })

// Run the server!
const start = async () => {
  try {
    await fastify.listen(process.env.PORT)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()