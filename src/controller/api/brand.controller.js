require('dotenv').config()
const Product = require('../../model/product')
const Brand = require('../../model/brand')

class ApiController {
    async getAll(req, res) {
        try {
            const brand = await Brand.find({}).sort({ brand_name: 1 }).lean()
            if (!brand)
                throw "Không tìm thấy sản phẩm"
            res.json(brand)
        } catch (error) {
            console.log(error)
            res.json(error)
        }

    }


    async brand(req, res) {
        const brand_name = req.params.name
        try {
            const brand = await Brand.findOne({ brand: brand_name })
            res.json(brand)
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

    async getBtBrand(req, res) {
        const brand_name = req.params.name
        try {
            const products = await Product.find({ brand_name: brand_name }).sort({ time: -1 }).lean()
            if (!products) {
                throw "Không tìm thấy sản phẩm"
            }
            res.json(products)
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

}








module.exports = new ApiController;