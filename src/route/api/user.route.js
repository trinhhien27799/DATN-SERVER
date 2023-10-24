
const router = require('express').Router()
const controller = require('../../controller/api/user.controller')
const upload = require('../../utils/handleFile')
const { checkUser } = require('../../midleware/authentication')


//xác thực email
router.post('/receive-otp', controller.insertOtp)
router.post('/verify-otp', controller.verifyOtp)

//người dùng
router.post('/create-account', controller.createAccount)
router.post('/login', controller.login)
router.post('/auto-login', controller.loginWithToken)
router.post('/forgot-password', controller.forgotPassword)

//địa chỉ
router.post('/address/new', checkUser, controller.addAddress)
router.post('/address/get-all', checkUser, controller.getAddress)
router.post('/address/update', checkUser, controller.updateAddress)
router.post('/address/delete', checkUser, controller.deleteAddress)

//Cập nhật
router.post('/update/avatar', checkUser, upload.single('avatar'), controller.updateAvatar)
router.post('/update/fullname', checkUser, controller.updateFullname)




module.exports = router