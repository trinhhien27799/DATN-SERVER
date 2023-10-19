require('dotenv').config()
const Product = require('../../model/product')
const { uploadImage, deleteImage } = require('../../utils/uploadImage')
const { json } = require('express')

class ApiController {
    async getAll(req, res) {
        try {
            const products = await Product.find({}).sort({ time: -1 }).lean()
            products.forEach((product) => {
                delete product.description
                delete product.options
            })

            res.json(products)
        } catch (error) {
            res.json({ code: 500, message: "error" })
        }

    }
    async getItem(req, res) {
        const id_product = req.params.id
        try {
            const product = await Product.findOne({ _id: id_product })
            if (!product) {
                throw "Không tìm thấy sản phẩm"
            }
            res.json({ code: 200, message: "Lấy dữ liệu thành công", product })
        } catch (error) {
            console.log(error)
            res.json({code:500,message:"Lấy dữ liệu thất bại"})
        }
    }


}








module.exports = new ApiController;