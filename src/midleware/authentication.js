
require('dotenv').config()
const User = require('../model/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const SECRECT = process.env.SECRECT

async function checkUser(req, res, next) {
    const username = req.body.username
    const token = req.body.token
    try {
        const account = await jwt.verify(token, SECRECT)
        if (account.username !== username) {
            throw ""
        }
        const user = await User.findOne({ username: username, role: false })
        if (!user) {
            throw ""
        }
        const matches = await bcrypt.compare(account.password, user.password)
        if (!matches) {
            throw ""
        }
        delete req.body.token
        next()
    } catch (error) {
        console.log(error)
        res.json({ code: 403, message: "Xác thực thất bại" })
    }
}


async function checkAdmin(req, res, next) {
    const username = req.body.username
    const token = req.body.token
    try {
        const account = await jwt.verify(token, SECRECT)
        if (account.username !== username) {
            throw ""
        }
        const user = await User.findOne({ username: username, role: true })
        if (!user) {
            throw ""
        }
        const matches = await bcrypt.compare(account.password, user.password)
        if (!matches) {
            throw ""
        }
        delete req.body.token
        next()
    } catch (error) {
        console.log(error)
        res.json({ code: 403, message: "Xác thực thất bại" })
    }
}

module.exports = { checkUser, checkAdmin }


