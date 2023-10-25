var express = require('express')
var controller = require('../../controller/web/bill.controller')
var router = express.Router()

router.get('/', controller.list);
router.get('/detail/:id', controller.detail);


module.exports = router
