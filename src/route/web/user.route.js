var express = require('express')
var controller = require('../../controller/web/user.controller')
var router = express.Router()


router.post('/login', controller.login)
router.get('/login',controller.pageLogin)
router.get('/register',controller.pageRegister)

module.exports = router
