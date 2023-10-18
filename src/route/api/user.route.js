
const router = require('express').Router()
const controller = require('../../controller/api/user.controller')
const upload = require('../../utils/handleFile')


//xác thực email
router.post('/receive-otp', controller.insertOtp)
router.post('/verify-otp', controller.verifyOtp)

//người dùng
router.post('/create-account', controller.createAccount)
router.post('/login', controller.login)
router.post('/auto-login', controller.loginWithToken)
router.post('/forgot-password', controller.forgotPassword)

//địa chỉ
router.post('/address/new', controller.addAddress)
router.post('/address/get-all',controller.getAddress)
router.post('/address/update',controller.updateAddress)
router.post('/address/delete',controller.deleteAddress)





module.exports = router