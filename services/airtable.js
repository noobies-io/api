const fetch = require("node-fetch");

const EXPIRES = 60 * 1000;

module.exports = class Airtable {

  constructor() {
    console.log('Started service')
    this.cache = null
    this.cached = false
    this.time = null

    this.getPositions()
  }

  async getPositions() {
    if (this.cached && this.time > Date.now() - EXPIRES) {
      console.log('Cache hit!')
      return this.cache;
    } else {
      console.log('Cache miss :(')
      const response = await fetch('https://api.airtable.com/v0/appUWtWlwi7RLEtl3/Main', {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
        }
      })
      this.cache = await response.json()
      this.cached = true
      this.time = Date.now()

      return this.cache
    }
  }

}