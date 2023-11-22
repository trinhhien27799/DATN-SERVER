var express = require('express')
var controller = require('../../controller/web/user.controller')
var router = express.Router()
const { passport } = require('../../utils/authModule')
const { checkAdmin } = require('../../midleware/authentication')

router.post('/login', passport.authenticate('local', { failureRedirect: '/user/login', successRedirect: '/product' }))
router.get('/login', controller.pageLogin)
router.get('/register', controller.pageRegister)
router.post('/register/send-code/:email', controller.sendOtp)
router.post('/register', controller.register)

router.get('/', checkAdmin, controller.list)
router.get('/detail/:id', checkAdmin, controller.detail)
router.get('/insert', checkAdmin, controller.insert)
router.post('/insert', checkAdmin, controller.insert)
router.delete('/delete/:id', checkAdmin, controller.delete)

router.get('/dashboard', controller.dashboard);





module.exports = router
