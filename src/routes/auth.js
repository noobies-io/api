const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken');

const User = require('../models/user')
const Register = require('../models/register')
const PasswordReset = require('../models/password-reset')
const EmailChange = require('../models/email-change')

const mail = require('../services/mail')

module.exports = function (fastify, opts, next) {

  fastify.get('/login', async (request, reply) => {

    const token = request.cookies.token
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reply
          .code(401)
          .send({
            ok: false
          })
      } else {
        reply
          .code(200)
          .send({
            ok: true
          })
      }
    }) 
  })

  fastify.post('/login', async (request, reply) => {

    const email = request.body.email
    const password = request.body.password

    User.query({ email: { eq: email } })
      .exec()
      .then((data) => {
        if (data.count === 0)
          throw new Error("No users with that email")
        
        return data[0]
      })
      .then((user) => {
        return bcrypt.compare(password, user.password)
      })
      .then((res) => {

        if (!res)
          throw new Error("Wrong Password")

        const token = jwt.sign({
          email
        }, process.env.JWT_SECRET, {
          expiresIn: (86400 * 15)
        })

        reply
          .setCookie('token', token, { expires: new Date(Date.now() + 86400 * 15e3), httpOnly: true })
          .code(200)
          .send({
            ok: true
          })
      })
      .catch((err) => {
        reply
          .setCookie('token', '')
          .code(401)
          .send({
            ok: false
          })
        console.log(err)
      })
  })

  fastify.post('/register', async (request, reply) => {

    const email = request.body.email
    const password = request.body.password

    const hashedPassword = bcrypt.hash(password, 12)
    const randomToken = crypto.randomBytes(16).toString('hex')
    const hashedToken = bcrypt.hash(await randomToken, 12)

    console.log(randomToken)
    // Take advantage of multithreaded work
    Promise.all([hashedPassword, hashedToken])
      .then((hashedData) => {
        console.log(hashedData[1])
        const newRegister = new Register({
          email, 
          password: hashedData[0], 
          token: hashedData[1]
        })
        return newRegister.save()
      })
      .then(() => {
        return mail.sendRegisterEmail(email, randomToken)
      })
      .then((res) => {
        reply
          .code(200)
          .send({
            ok: true
          })
      })
      .catch((error) => { // TODO handle this better
        console.log(error)
        reply
          .code(500)
          .send({
            ok: false
          })
      })
  })

  fastify.post('/confirm-register', async (request, reply) => {

    const email = request.body.email
    const token = request.body.token
    let user = {}

    console.log(token)

    Register.query({ email: { eq: email } })
      .exec()
      .then((data) => {
        if (data.count === 0)
          throw new Error("Email is not registered yet")

        user = data[0]

        return bcrypt.compare(token, user.token)
      })
      .then((res) => {
        if (!res)
          throw new Error("Tokens do not match")

        const newUser = new User({
          email: user.email,
          password: user.password
        })

        return newUser.save()
      })
      .then((data) => {
        console.log(data)
        reply
          .code(200)
          .send({
            ok: true
          })
        
        Register.delete({ email })
      })
      .catch((error) => {
        console.log(error)
        reply
          .code(500)
          .send({
            ok: false
          })
      })
  })

  fastify.post('/reset-password', async (request, reply) => {
    
    const email = request.body.email
    let token = ''

    User.query({ email: { eq: email }})
      .exec()
      .then((data) => {
        if (data.count === 0)
          throw new Error("Email is not registered yet")

        return crypto.randomBytes(16).toString('hex')
      })
      .then((randomToken) => {
        token = randomToken

        return bcrypt.hash(randomToken, 12)
      })
      .then((hashedToken) => {

        const newPasswordReset = new PasswordReset({
          email,
          hashedToken
        })

        return newPasswordReset.save()
      })
      .then((hashed) => {
        return mail.sendPasswordResetEmail(email, token)
      })
      .then((res) => {
        reply
          .code(200)
          .send({
            ok: true
          })
      })
      .catch((error) => { // TODO handle this better
        console.log(error)
        reply
          .code(500)
          .send({
            ok: false
          })
      })
  })

  fastify.post('/confirm-password', async (request, reply) => {

  })

  fastify.post('/change-email', async (request, reply) => {
    const email = request.body.email
    let token = ''

    User.query({ email: { eq: email } })
      .exec()
      .then((data) => {
        if (data.count === 0)
          throw new Error("Email is not registered yet")

        return crypto.randomBytes(16).toString('hex')
      })
      .then((randomToken) => {
        token = randomToken

        return bcrypt.hash(randomToken, 12)
      })
      .then((hashedToken) => {

        const newEmailChange = new EmailChange({
          email,
          hashedToken
        })

        return newEmailChange.save()
      })
      .then((hashed) => {
        return mail.sendEmailChangeEmail(email, token)
      })
      .then((res) => {
        reply
          .code(200)
          .send({
            ok: true
          })
      })
      .catch((error) => { // TODO handle this better
        console.log(error)
        reply
          .code(500)
          .send({
            ok: false
          })
      })
  })

  fastify.post('/confirm-email', async (request, reply) => {

  })

  next()
}