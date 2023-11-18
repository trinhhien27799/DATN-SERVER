
const router = require('express').Router()
const controller = require('../../controller/api/type.controller')
const upload = require('../../utils/handleFile')


router.get('/get/:product_type_id', controller.getByType)// lấy danh sách sản phẩm theo type
router.get('/get-all', controller.getAll)//lấy danh sách type
router.post('/add', upload.single('image'), controller.add)
module.exports = router