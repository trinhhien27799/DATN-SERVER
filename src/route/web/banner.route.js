var express = require('express')
var controller = require('../../controller/web/banner.controller')
var router = express.Router()
const upload = require('../../utils/handleFile')


router.get('/', controller.list)
router.get('/detail/:id', controller.detail)
router.get('/insert', controller.insert);
router.post('/insert', upload.single('image'), controller.insert);
router.put('/content/:id', upload.single('image'), controller.putContent)
router.get('/edit/:id', controller.edit);
router.post('/edit',upload.single('image'), controller.editPost);
router.delete('/delete/:id', controller.delete)





module.exports = router
