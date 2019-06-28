const fetch = require("node-fetch");

//const EXPIRES = 60 * 1000;

module.exports = class Airtable {

  /**
   * This will store all the positions avaliable and organize them.
   */
  constructor() {
    this.positions = null
    this.hot = null
    this.updatePositions()
  }

  getPositions() {
    return this.positions
  }

  getHotPositions() {
    return this.hot
  }

  async updatePositions() { // TODO - Implement hot mechanism
    try {
      const response = await fetch('https://api.airtable.com/v0/appIzularDDL2q6Mw/Main', {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
        }
      })

      const airtableData = await response.json()

      this.positions = airtableData.records.map((entry) => {
        console.log(entry.fields)
        let newEntry = {
          title: entry.fields.Title,
          category: entry.fields.Category,
          company: entry.fields.Company,
          smallLogo: entry.fields.Logo[0].thumbnails.large.url,
          bigLogo: entry.fields.Logo[0].thumbnails.full.url,
          duration: entry.fields.Duration,
          location: entry.fields.Title,
          description: entry.fields.Description,
          requirements: entry.fields.Requirements,
          url: entry.fields['URL'],
          date: entry.fields.Date,
          payment: entry.fields.Payment
        }

        return newEntry
      })

      return true
    } catch (err) {
      return false
    }
  }
}