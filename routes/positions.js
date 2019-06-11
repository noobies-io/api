const fetch = require("node-fetch");

module.exports = function (fastify, opts, next) {

  fastify.get('/', async (request, reply) => {
    try {
      const response = await fetch('https://api.airtable.com/v0/appUWtWlwi7RLEtl3/Main', {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
        }
      })
      const json = await response.json()
      console.log(json)
      return json
    } catch (error) {
      return { error: 'Error' }
    }
  })

  next()
}