const express = require('express')
const controller = require('../../controller/web/product.controller')
const router = express.Router()
const upload = require('../../utils/handleFile')


router.post('/add', controller.newProduct)
router.get('', controller.pageHome)
router.get('/new', controller.pageNewProduct)

router.get('/:id/variations/add', controller.pageNewVariations)
router.post('/:id/variations/add', upload.single('image'), controller.NewVariations)
router.get('/:id/variations', controller.pageVariations)
router.delete('/delete/:id', controller.deleteProduct)
router.delete('/:product_id/variations/delete/:id', controller.deleteVariations)
router.get('/update/:id', controller.detailProduct)
router.put('/update/:id', controller.updateProduct)
router.get('/description/:id', controller.pageDescription)
router.post('/description/:id', upload.single('image'), controller.addDescription)

router.delete('/:id_product/delete/description/:id_description', controller.deleteDescription)


module.exports = router
