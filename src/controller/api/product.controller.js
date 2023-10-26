require('dotenv').config()
const Product = require('../../model/product')
const { uploadImage, deleteImage } = require('../../utils/uploadImage')
const Brand = require('../../model/brand')

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

            res.json(product)
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Lấy dữ liệu thất bại" })
        }
    }

    async search(req, res) {
        const query_text = req.query.query_text
        const min_price = req.query.min_price
        const max_price = req.query.max_price
        console.log(query_text, min_price, max_price)
        var array = []
        try {
            if (query_text) {
                const products_text = await Product.find({
                    $or: [
                        { product_name: { '$regex': query_text, '$options': 'i' } },
                        { brand_name: { '$regex': query_text, '$options': 'i' } },
                        { description: { '$regex': query_text, '$options': 'i' } }]
                })
                if (!products_text) {
                    throw "Lọc theo text thất bại"
                }
                array.concat(products_text)
            }

            if (!min_price && !max_price) {
                const products_prict = await Product.find({
                    default_price: { $gte: min_price },
                    max_price: { $lte: max_price }
                })
                if (!products_prict) {
                    throw "Lọc theo giá thất bại"
                }
                array.concat(products_prict)
            }
            res.json({ code: 200, message: "Lọc thành công", array })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Đã xảy ra lỗi" })
        }
    }

    async brand(req, res) {
        const brand = req.params.name
        const regex = new RegExp("^" + brand + "$", "i")
        try {
            const brand = await Brand.findOne({ brand: { $regex: regex } })
            res.json(brand)
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

}








module.exports = new ApiController;