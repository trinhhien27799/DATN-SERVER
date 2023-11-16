require('dotenv').config()
const Shipping = require('../../model/shipping')
const { uploadImage, deleteImage } = require('../../utils/uploadImage')

class ApiController {
    async getAll(req, res) {
        try {
            const shipping = await Shipping.find({})
            if (!shipping)
                throw "Không tìm thấy phương thức vận chuyển"
            res.json(shipping)
        } catch (error) {
            console.log(error)
            res.json(error)
        }

    }


    async getByType(req, res) {
        const code = req.params.code
        try {
            const shipping = await Shipping.findOne({ code: code })
            if (!shipping) {
                throw "Không tìm thấy phương thức vận chuyển"
            }
            res.json(shipping)
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

    async add(req, res) {
        try {
            const data = req.body
            const type_product = await Shipping.create(data)
            res.json(type_product)
        } catch (error) {
            console.log(error)
            res.json(error)
        }

    }

}








module.exports = new ApiController;