const express = require('express')
const controller = require('../../controller/web/product.controller')
const router = express.Router()
const upload = require('../../utils/handleFile')


router.post('/product/add', controller.newProduct)
router.get('/product', controller.pageHome)
router.get('/product/new', controller.pageNewProduct)
router.get('/product/:id', controller.editProduct)
router.put('/product/update/:id', controller.updateProduct)
router.put('/product/option/:id', upload.single('image'), controller.putOption)
router.put('/product/description/:id', upload.single('image'), controller.putDescription)
router.delete('/product/delete/:id', controller.deleteProduct)
router.delete('/product/:id_product/delete/description/:id_description', controller.deleteDescription)
router.delete('/product/:id_product/delete/:id_color', controller.deleteOption)

router.get('/product/add_op/:id', controller.add_op)
router.post('/product/add_op', controller.add_op2)


module.exports = router
