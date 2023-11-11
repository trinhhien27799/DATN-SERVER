var express = require('express')
var controller = require('../../controller/web/brand.controller')
var router = express.Router()
const upload = require('../../utils/handleFile')
const { checkAdmin } = require('../../midleware/authentication')

router.get('/', checkAdmin, controller.list);
router.get('/detail/:id', checkAdmin, controller.detail);
router.get('/insert', checkAdmin, controller.insert);
router.post('/insert', checkAdmin, upload.single('image'), controller.insert);
router.get('/edit/:id', checkAdmin, controller.edit);
router.post('/edit', upload.single('image'), checkAdmin, controller.editPost);
router.delete('/delete/:id', checkAdmin, controller.delete)


module.exports = router
