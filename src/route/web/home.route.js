var express = require('express')
var controller = require('../../controller/web/product.controller')
var router = express.Router()


router.get('/product', controller.pageHome)

module.exports = router
