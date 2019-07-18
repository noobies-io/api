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

  async updatePositions() { // TODO - Implement hot mechanism
    try {
      const response = await fetch('https://api.airtable.com/v0/appIzularDDL2q6Mw/Posi%C3%A7%C3%B5es', {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
        }
      })

      const airtableData = await response.json()

      this.positions = airtableData.records.map((entry) => {
        let newEntry = {
          title: entry.fields.Title,
          category: entry.fields.Category,
          company: entry.fields.CompanyName[0],
          smallLogo: entry.fields.Logo[0].thumbnails.large.url,
          bigLogo: entry.fields.Logo[0].thumbnails.full.url,
          duration: entry.fields.Duration,
          paid: entry.fields.Paid,
          location: entry.fields.Location,
          description: entry.fields.Description,
          requirements: entry.fields.Requirements,
          url: entry.fields['URL'],
          date: entry.fields.Date,
          payment: entry.fields.Paid,
          qualifications: entry.fields.Qualifications
        }

        return newEntry
      })

      this.positions = shuffle(this.positions)

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