const express = require('express')
const controller = require('../../controller/web/product.controller')
const router = express.Router()
const upload = require('../../utils/handleFile')


router.post('/product/add', controller.newProduct)
router.get('/product', controller.pageHome)
router.get('/product/new', controller.pageNewProduct)
router.get('/product/:id', controller.detailProduct)
router.put('/product/update/:id', controller.updateProduct)
router.put('/product/option/:id', upload.single('image'), controller.putOption)
router.delete('/product/delete/:id', controller.deleteProduct)
router.delete('/product/:id_product/delete/:option/:id_option', controller.deleteOption)
module.exports = router
