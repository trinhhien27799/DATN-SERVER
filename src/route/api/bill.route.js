
const router = require('express').Router()
const controller = require('../../controller/api/bill.controller')
const {checkUser} = require('../../midleware/authentication')

router.post('/create', checkUser, controller.createBill)
router.post('/detail/:id', checkUser, controller.detail)
router.post('/:status', checkUser, controller.getByStatus)
router.post('/get-all',checkUser,controller.getAll)
router.post('/cancel', checkUser, controller.cancelBill)


module.exports = router