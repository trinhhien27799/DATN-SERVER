
const router = require('express').Router()
const controller = require('../../controller/api/message.controller')
const upload = require('../../utils/handleFile')


router.post('/history', controller.history)
module.exports = router