
const Variations = require('../../model/variations')
const Product = require('../../model/product')
const Cart = require('../../model/cart')

class ApiController {
    async getAll(req, res) {
        const username = req.body.username
        try {
            const carts = await Cart.find({ username: username }).lean()
            if (!carts) {
                throw "Không lấy được danh sách giỏ hàng"
            }
            for (let i = 0; i < carts.length; i++) {
                const variations = await Variations.findById(carts[i].variations_id)
                if (!variations) {
                    delete carts[i]
                    break
                }
                carts[i].price = variations.price
                const product = await Product.findById(variations.productId)
                if(!product){
                    delete carts[i]
                    break
                }
                carts[i].product_name = product.product_name
                carts[i].brand_name = product.brand_name
            }
            res.json(carts)
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

    async add(req, res) {
        const data = req.body
        try {
            const variations = await Variations.findById(data.variations_id)
            if(!variations){
                throw "Biến thể không tồn tại"
            }
            const cart =await Cart.create(data)
            if(!cart){
                throw "Thêm giỏ hàng thất bại"
            }
            res.json(cart)
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

    async delete(req, res) {
        const listIdCart = req.body.listIdCart
        const username = req.body.username
        try {
            const del = await Cart.deleteMany({ username: username, _id: { $in: listIdCart } })
            console.log("Đã xóa giỏ hàng: ",del.deletedCount)
            res.json(del.deletedCount) //trả về số lượng bản ghi đã xóa 
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Đã xảy ra lỗi" })
        }
    }

    async update(req, res) {
        const cart_id = req.body.cart_id
        const quantity = req.body.quantity
        try {
            const cart = await Cart.findOneAndUpdate({_id:cart_id},{$set:{quantity:quantity}})
            if(!cart){
                throw ""
            }
            res.json({ code: 200, message: "Cập nhật giỏ hàng thành công" })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Đã xảy ra lỗi" })
        }
    }
}









module.exports = new ApiController;