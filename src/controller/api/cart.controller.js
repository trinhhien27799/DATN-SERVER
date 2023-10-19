
const User = require('../../model/user')
const Bill = require('../../model/bill')
const Cart = require('../../model/cart')

class ApiController {
    async getAll(req, res) {
        const username = req.body.username
        try {
            const carts = await Cart.find({ username: username })
            if (!carts) {
                throw "Không lấy được danh sách giỏ hàng"
            }
            res.json({ code: 500, message: "Lấy dữ liệu thành công", carts })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Đã xảy ra lỗi" })
        }
    }

    async add(req, res) {
        const data = req.body
        try {
            const cart = await Cart.create(data)
            if (!cart) {
                throw "Thêm thất bại"
            }
            res.json({ code: 200, message: "Thêm thành công", cart })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Đã xảy ra lỗi" })
        }
    }

    async delete(req, res) {
        const id_cart = req.body.id_cart
        const username = req.body.username
        try {
            const cart = await Cart.findById(id_cart)
            if (!cart) {
                throw "Không tìm thấy giỏ hàng"
            }
            if (cart.username !== username) {
                throw "Giỏ hàng không hợp lệ"
            }
            await cart.deleteOne()
            res.json({ code: 200, message: "Xóa giỏ hàng thành công", id_cart: id_cart })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Đã xảy ra lỗi" })
        }
    }

    async update(req, res) {
        const username = req.body.username
        const id_cart = req.body.id_cart
        const quantity = req.body.quantity
        console.log(quantity)
        try {
            const cart = await Cart.findById(id_cart)
            if (!cart) {
                throw "Không tìm thấy giỏ hàng"
            }
            if (cart.username !== username) {
                throw "Giỏ hàng không hợp lệ"
            }
            cart.quantity = quantity
            await cart.save()
            res.json({ code: 200, message: "Cập nhật giỏ hàng thành công", cart })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Đã xảy ra lỗi" })
        }
    }
}









module.exports = new ApiController;