
const router = require('express').Router()
const controller = require('../../controller/api/favorite.controller')
const {checkUser} = require('../../midleware/authentication')

router.post('/add', checkUser, controller.add)
router.post('/get-all', checkUser, controller.getAll)
router.post('/delete', checkUser, controller.delete)
router.post('/check', checkUser, controller.check)

module.exports = router