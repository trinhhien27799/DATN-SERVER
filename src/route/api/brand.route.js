
const router = require('express').Router()
const controller = require('../../controller/api/brand.controller')


router.get('/detail/:name',controller.brand)// lấy thông tin brand
router.get('/get/:brand_id',controller.getBtBrand)// lấy danh sách sản phẩm theo brand
router.get('/get-all',controller.getAll)//lấy danh sách brand
module.exports = router