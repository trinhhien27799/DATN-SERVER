require('dotenv').config()
const Product = require('../../model/product')
const { uploadImage, deleteImage } = require('../../utils/uploadImage')
const Brand = require('../../model/brand')
const Variations = require('../../model/variations')
const Description = require('../../model/description')

class ApiController {
    async getAll(req, res) {
        try {
            const products = await Product.find({}).sort({ time: -1 }).lean()
            if (!products) {
                throw "Không tìm thấy sản phẩm"
            }
            products.forEach(async (product) => {
                delete product.description

            })

            res.json(products)
        } catch (error) {
            res.json({ code: 500, message: "error" })
        }

    }
    async getItem(req, res) {
        const id_product = req.params.id
        try {
            const product = await Product.findOne({ _id: id_product }).lean()
            if (!product) {
                throw "Không tìm thấy sản phẩm"
            }
            const regex = new RegExp("^" + product.brand_name + "$", "i")
            const brand = await Brand.findOne({ brand: { $regex: regex } })
            if (brand) {
                product.brand_logo = brand.image
            }
            const variations = await Variations.find({ productId: id_product }).lean()
            if (variations) {
                variations.forEach((item) => delete item.productId)
                product.variations = variations
            }
            const description = await Description.find({ id_follow: id_product }).lean()
            if (description) {
                description.forEach((item) => {
                    delete item._id
                    delete item.id_follow
                    delete item.__v
                })
                product.description = description
            }
            delete product.__v
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