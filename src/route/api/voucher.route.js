
const router = require('express').Router()
const controller = require('../../controller/api/voucher.controller')
const {checkUser} = require('../../midleware/authentication')

router.post('/get-all', controller.getAll)// lấy tất cả voucher trên hệ thống mà người dùng chưa thêm
router.post('/add', checkUser, controller.add)
router.post('/get', checkUser, controller.get)// lấy voucher của user

module.exports = router