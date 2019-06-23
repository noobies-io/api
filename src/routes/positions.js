const fetch = require("node-fetch");
const Airtable = require("../services/airtable")

module.exports = function (fastify, opts, next) {

  this.a = new Airtable()

  fastify.get('/', async (request, reply) => {
    try {
      let json = await this.a.getPositions()
      return json
    } catch (error) {
      console.log(error)
      return { error: 'Error' }
    }
  })

  next()
}