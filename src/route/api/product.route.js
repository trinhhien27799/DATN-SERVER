
const router = require('express').Router()
const controller = require('../../controller/api/product.controller')


router.get('/get-all',controller.getAll)
router.post('/insert-product',controller.insert)
module.exports = router