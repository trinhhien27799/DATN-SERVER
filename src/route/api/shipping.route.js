
const router = require('express').Router()
const controller = require('../../controller/api/shipping.controller')
const upload = require('../../utils/handleFile')


router.get('/get/:code', controller.getByType)// lấy danh sách sản phẩm theo type
router.get('/get-all', controller.getAll)//lấy danh sách type
router.post('/add', upload.single('image'), controller.add)
module.exports = router