require('dotenv').config()
const Product = require('../../model/product')
const Type = require('../../model/typeProduct')
const { uploadImage, deleteImage } = require('../../utils/uploadImage')

class ApiController {
    async getAll(req, res) {
        try {
            const type_product = await Type.find({}).sort({ name: 1 }).lean()
            if (!type_product)
                throw "Không tìm thấy loại sản phẩm"
            res.json(type_product)
        } catch (error) {
            console.log(error)
            res.json(error)
        }

    }


    async getByType(req, res) {
        const product_type = req.params.name
        try {
            const products = await Product.find({ product_type: product_type }).sort({ time: -1 }).lean()
            if (!products) {
                throw "Không tìm thấy sản phẩm"
            }
            res.json(products)
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

    async add(req, res) {
        try {
            const data = req.body
            if (req.file != null && req.file != undefined) {
                const filename = req.file.filename;
                const filepath = req.file.path;
                const url = await uploadImage(filepath, filename);
                data.image = url;
            }
            const type_product = await Type.create(data)
            res.json(type_product)
        } catch (error) {
            console.log(error)
            res.json(error)
        }

    }

}








module.exports = new ApiController;