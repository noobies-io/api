const Airtable = require("../services/airtable")

module.exports = function (fastify, opts, next) {

  this.airtableService = new Airtable()

  /**
   * Get all positions (bandwidth intensive)
   */
  fastify.get('/', async (request, reply) => {
    return this.airtableService.getPositions()
  })

  /**
   * Get the positions displayed in the main page
   */
  fastify.get('/main', async (request, reply) => {
    return this.airtableService.getHotPositions()
  })

  /**
   * Get positions filtered with query details
   * 
   * @body ?category - String identifying the category (Example: "Science")
   * @body ?duration - String with the duration (Example: "3 meses")
   * @body ?location - String with the location (Example: "Lisbo")
   * @body ?pay - Any value. If none is present all results are shown. If
   * any value is present we will assume you want payed internships.
   * @body ?degree - Any value. If none is present all results are shown.
   * If any value is present we will return positions that need a graduate. 
   * @body ?text - String with a company or title name. Both will be checked
   */
  fastify.get('/filter', async (request, reply) => {

    const category = request.query.category
    const duration = request.query.duration
    const location = request.query.location
    const pay = request.query.pay
    const degree = request.query.requirement
    const textSearch = request.query.text.toLowerCase()

    const positions = await this.airtableService.getPositions()

    const filteredPositions = positions.filter((item) => {
      return (category ? item.category === category : true) &&
        (duration ? item.duration === duration : true) &&
        (location ? item.location === location : true) &&
        (pay ? item.payment !== 0 : true) &&
        (degree ? item.degree === 'yes' : true) &&
        (textSearch ? (
          (textSearch ? item.company.toLowerCase().includes(textSearch) : false) ||
          (textSearch ? item.title.toLowerCase().includes(textSearch) : false)
        ) : true)
    })
  
    reply.code(200).send(filteredPositions)
  })

  /**
   * Cancel cache and fetch new data from Airtable
   */
  fastify.get('/update', async (request, reply) => {

    let success = await this.airtableService.updatePositions()

    if (success) {
      reply.code(200).send({ ok: true })
    } else {
      reply.code(500).send({ ok: false })
    }
  })

  next()
}