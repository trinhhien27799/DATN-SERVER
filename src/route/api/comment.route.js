
const router = require('express').Router()
const controller = require('../../controller/api/comment.controller')
const upload = require('../../utils/handleFile')
const { checkUser } = require('../../midleware/authentication')


router.get('/:productId', controller.getAll)
router.post('/add', upload.array('image'), checkUser, controller.add)
router.post('/check', checkUser, controller.check)


router.post('', upload.array('image'), controller.test)

module.exports = router