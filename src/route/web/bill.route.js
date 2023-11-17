var express = require('express')
var controller = require('../../controller/web/bill.controller')
var router = express.Router()

const { checkAdmin } = require('../../midleware/authentication')

router.get('/', checkAdmin, controller.list);
router.get('/detail/:id', checkAdmin, controller.detail);
router.get('/confirmBill/:id', controller.confirmBill);


module.exports = router
