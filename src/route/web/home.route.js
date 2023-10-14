var express = require('express')
var controller = require('../../controller/web/product.controller')
var router = express.Router()

router.post('/product/add', controller.newProduct)
router.get('/product', controller.pageHome)
router.get('/product/new', controller.pageNewProduct)
router.get('/product/:id', controller.detailProduct)
module.exports = router
