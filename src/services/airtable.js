const fetch = require("node-fetch");

//const EXPIRES = 60 * 1000;

module.exports = class Airtable {

  /**
   * This will store all the positions avaliable and organize them.
   */
  constructor() {
    this.positions = null
    this.updatePositions()
  }

  getPositions() {
    return this.positions
  }

  getSomePositions() {
    return this.positions.slice(0, 10)
  }

  async updatePositions() {
    try {
      const response = await fetch('https://api.airtable.com/v0/appAF9Tj6mjluOJhV/Positions', {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
        }
      })

      const airtableData = await response.json()

      const positions = []
      
      for (let i = 0; i < airtableData.records.length; i++) {
        const entry = airtableData.records[i]
        try {
          const newEntry = {
            title: entry.fields.Title,
            company: entry.fields.Company,
            logo: entry.fields.Logo[0].thumbnails.full.url,
            url: entry.fields.URL
          }
          positions.push(newEntry)
        } catch { }
      }

      this.positions = this.shuffle(positions)

      return true
    } catch (err) {
      return false
    }
  }

  shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}