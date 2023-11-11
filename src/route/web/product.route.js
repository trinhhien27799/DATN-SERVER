const express = require('express')
const controller = require('../../controller/web/product.controller')
const router = express.Router()
const upload = require('../../utils/handleFile')
const { checkAdmin } = require('../../midleware/authentication')



router.post('/add', checkAdmin, controller.newProduct)
router.get('', checkAdmin, controller.pageHome)
router.get('/new', checkAdmin, controller.pageNewProduct)

router.get('/:id/variations/add', checkAdmin, controller.pageNewVariations)
router.post('/:id/variations/add', checkAdmin, upload.single('image'), controller.NewVariations)
router.get('/:id/variations', checkAdmin, controller.pageVariations)
router.delete('/delete/:id', checkAdmin, controller.deleteProduct)
router.delete('/:product_id/variations/delete/:id', checkAdmin, controller.deleteVariations)
router.get('/update/:id', checkAdmin, controller.detailProduct)
router.put('/update/:id', checkAdmin, controller.updateProduct)
router.get('/description/:id', checkAdmin, controller.pageDescription)
router.post('/description/:id', checkAdmin, upload.single('image'), controller.addDescription)

router.delete('/:id_product/delete/description/:id_description', checkAdmin, controller.deleteDescription)


module.exports = router
