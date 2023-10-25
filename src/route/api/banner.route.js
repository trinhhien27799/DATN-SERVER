const router = require('express').Router()
const controller = require('../../controller/api/banner.controller')




router.post('/add', controller.add)
router.post('/update', controller.update)
router.get('/get-all', controller.getAll)
router.get('/:id', controller.getById)

module.exports = router