
const router = require('express').Router()
const controller = require('../../controller/api/product.controller')

router.get('/search',controller.search)
router.get('/get-all',controller.getAll)
router.get('/:id',controller.getItem)

module.exports = router