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
    return this.airtableService.getSomePositions()
  })

  /**
   * Get positions filtered with query details
   * 
   * @body ?category - String identifying the category (Example: "Science")
   * @body ?duration - String with the duration (Example: "3 meses")
   * @body ?location - String with the location (Example: "Lisbo")
   * @body ?pay - Any value. If none is present all results are shown. If
   * any value is present we will assume you want payed internships.
   * @body ?text - String with a company or title name. Both will be checked
   */
  fastify.get('/filter', async (request, reply) => {

    const category = request.query.category
    const duration = request.query.duration
    const location = request.query.location
    const pay = request.query.pay
    const textSearch = request.query.text

    const positions = await this.airtableService.getPositions()

    const filteredPositions = positions.filter((item) => {
      return filterCategory(category, item) &&
        filterDuration(duration, item) &&
        filterLocation(location, item) &&
        filterPay(pay, item) &&
        filterText(textSearch, item)
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

const filterCategory = (category, item) => {

  if (!category) {
    return true
  } else {
    return item.category === category
  }
}

// TODO
const filterDuration = (duration, item) => {
 return true
}

const filterLocation = (location, item) => {
  
  if (!location) {
    return true
  } else {
    return item.location === location
  }
}

const filterPay = (pay, item) => {

  if (!pay) {
    return true
  } else {
    return item.paid === pay
  }
}
  
const filterText = (textSearch, item) => {

  const text = textSearch ? textSearch.toLowerCase() : null
  
  if (!text) {
    return true
  } else {
    return item.company.toLowerCase().includes(text) || item.title.toLowerCase().includes(text)
  }

}