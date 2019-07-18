const api_key = process.env.MAILGUN_API_KEY;
const domain = 'noobies.io';
const mailgun = require('mailgun-js')({
  apiKey: api_key, 
  domain: domain,
  host: 'api.eu.mailgun.net'
});
const fs = require('fs')
const util = require('util');

module.exports = {

  sendRegisterEmail: async (email, TOKEN) => {

    let html = await loadTemplate('register', { EMAIL: email, TOKEN })
    let data = {
      from: 'Noobies <welcome@noobies.io>',
      to: email,
      subject: 'Welcome to Noobies!',
      html
    }

    return mailgun.messages().send(data)
  },

  sendPasswordResetEmail: async (email, TOKEN) => {

    let html = await loadTemplate('reset-password', { EMAIL: email, TOKEN })
    let data = {
      from: 'Noobies <welcome@noobies.io>',
      to: email,
      subject: 'Noobies: Password Recover',
      html
    }

    return mailgun.messages().send(data)
  },

  sendEmailChangeEmail: async (email, TOKEN) => {

    let html = await loadTemplate('change-email', { EMAIL: email, TOKEN })
    let data = {
      from: 'Noobies <welcome@noobies.io>',
      to: email,
      subject: 'Noobies: Email Change',
      html
    }

    return mailgun.messages().send(data)
  },
}

/**
 * Reads a template from our assets folder named
 * with the input 'name'.html and automatically
 * replaces all the placeholder text with each
 * key from args and the value that key stores.
 * 
 * Example: args = { TOKEN : "FooBar"}
 * Replaces all TOKEN in the template with FooBar
 */
loadTemplate = async (name, args) => {
  const readFile = util.promisify(fs.readFile)
  return readFile(`./src/assets/${name}.html`, 'utf8')
    .then((data) =>  {

      let file = data

      if (!args) throw new Error('Undefined props')

      for (const prop of Object.keys(args)) {
        // undefined prop
        if (!args[prop]) throw new Error(`Undefined prop ${prop}`)

        file = file.replace(new RegExp(prop, 'g'), args[prop])
      }

      return file
    })
}