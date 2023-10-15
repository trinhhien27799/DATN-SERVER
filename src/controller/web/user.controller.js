const User = require("../../model/user")
const Otp = require("../../model/otp")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')
const { sendEmail } = require('../../utils/emailSender')

require('dotenv').config

const SECRECT = process.env.SECRECT

class Controller {
  pageLogin(req, res) {
    res.render('auth/login.ejs', { layout: 'layouts/auth' })
  }

  pageRegister(req, res) {
    res.render('auth/register.ejs', {
      layout: 'layouts/auth',
      email: null,
      error: null
    })
  }


  async login(req, res) {
    const { username, password } = req.body

    try {
      const user = await User.findOne({ username: username, role: true })
      if (!user) {
        return res.render('auth/login.ejs', {
          layout: 'layouts/auth',
          data: {
            code: 404,
            message: "Tài khoản Không tồn tại",
          }
        })
      }
      const hashPassword = user.password
      const matches = await bcrypt.compare(password, hashPassword)
      if (!matches) {
        return res.render('auth/login.ejs', {
          layout: 'layouts/auth',
          data: {
            code: 404,
            message: "Tài khoản hoặc mật khẩu không chính xác",
          }
        })
      }

      user.password = null
      const token = await jwt.sign({ username: username, password: password, role: user.role }, SECRECT)
      res.redirect('/home/product')
    } catch (error) {
      console.log(error)
      res.json(error)
    }
  }

  async sendOtp(req, res) {
    try {
      const email = req.params.email
      const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
      const isEmail = emailPattern.test(email)
      if (!isEmail) {
        throw 'Email invalid!'
      }
      const check = await User.findOne({ username: email })
      if (check) {
        throw 'Email already exists!'
      }
      const num = await otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
      const salt = await bcrypt.genSalt(10)
      const subject = "Xác nhận email"
      const text = `Mã xác nhận của bạn là ${num}`
      sendEmail(email, subject, text)
      const otp = await bcrypt.hash(num, salt)
      const rs = await Otp.create({ username: email, otp: otp })
      res.render('auth/register.ejs', {
        layout: 'layouts/auth',
        email: email,
        error: null
      })
    } catch (error) {
      console.log(error)
      res.render('auth/register.ejs', {
        layout: 'layouts/auth',
        email: null,
        error: error
      })
    }

  }

  async register(req, res) {
    const body = req.body
    const otp = body.code
    delete body.code
    try {
      const otpHolder = await Otp.find({ username: body.username })
      if (!otpHolder) {
        throw 'OTP authentication failed!'
      }
      const hashOtp = otpHolder[otpHolder.length - 1].otp
      const matches = await bcrypt.compare(otp, hashOtp)
      if (!matches) {
        throw 'OTP not correct!'
      }
      await Otp.deleteMany({ username: body.username })
      body.role = true
      const salt = await bcrypt.genSalt(10)
      const password = body.password
      const hashPass = await bcrypt.hash(password, salt)
      body.password = hashPass
      await User.create(body)
      res.render('auth/register.ejs', {
        layout: 'layouts/auth',
        email: null,
        error: "Register successful"
      })
    } catch (error) {
      console.log(error)
      res.render('auth/register.ejs', {
        layout: 'layouts/auth',
        email: body.email,
        error: error
      })
    }
  }

}

module.exports = new Controller    
