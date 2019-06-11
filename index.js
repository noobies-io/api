// Get environment variables
require('dotenv').config()

// Require the framework and instantiate it
const fastify = require('fastify')({ logger: false })

// Routes handled in different JSs
const positions = require('./routes/positions')

// Register route handlers
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