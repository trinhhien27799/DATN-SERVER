require('dotenv').config()
const Product = require('../../model/product')
const { uploadImage, deleteImage } = require('../../ultils/uploadImage')
const { json } = require('express')

class ApiController {
    async getAll(req, res) {
        try {
            const products = await Product.find({}).exec()
            res.json(products)
        } catch (error) {
            res.json({ code: 500, message: "error" })
        }

    }

    insert(req, res) {
        const body = req.body
        Product.create(body)
            .then((rs) => res.json({ code: 200, message: "insert successful" }))
            .catch((e) => res.json({ code: 500, message: e }))
    }
}



// if (req.file != null && req.file != undefined) {
//     const filename = req.file.filename;
//     const filepath = req.file.path;
//     const url = await uploadImage(filepath, filename);
//     account.image = url;
// }





module.exports = new ApiController;