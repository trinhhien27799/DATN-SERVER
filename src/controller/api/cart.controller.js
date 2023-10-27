
const User = require('../../model/user')
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
                const product = await Product.findById(carts[i].product_id)
                if (!product) {
                    delete carts[i]
                    break
                }
                carts[i].product_name = product.product_name
                carts[i].brand_name = product.brand_name
                let total = product.default_price
                for (let item of product.options.colors) {
                    if (item._id == carts[i].color_id) {
                        total += item.increase_price
                        carts[i].image = item.image
                        carts[i].color = item.color
                    }
                }
                for (let item of product.options.rams) {
                    if (item._id == carts[i].ram_id) {
                        total += item.increase_price
                        carts[i].ram = item.size
                    }
                }
                for (let item of product.options.roms) {
                    if (item._id == carts[i].rom_id) {
                        total += item.increase_price
                        carts[i].rom = item.size
                    }
                }
                carts[i].price = total
                delete carts[i].color_id
                delete carts[i].ram_id
                delete carts[i].rom_id
            }
            res.json(carts)
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
            const product = await Product.findById(cart.product_id)
            if (!product) {
                throw ""
            }
            cart.product_name = product.product_name
            cart.brand_name = product.brand_name
            let total = product.default_price
            for (let item of product.options.colors) {
                if (item._id == cart.color_id) {
                    total += item.increase_price
                    cart.image = item.image
                    cart.color = item.color
                }
            }
            for (let item of product.options.rams) {
                if (item._id == cart.ram_id) {
                    total += item.increase_price
                    cart.ram = item.size
                }
            }
            for (let item of product.options.roms) {
                if (item._id == cart.rom_id) {
                    total += item.increase_price
                    cart.rom = item.size
                }
            }
            cart.price = total
            delete cart.color_id
            delete cart.ram_id
            delete cart.rom_id
            res.json(cart)
        } catch (error) {
            console.log(error)
            res.json("Đã xảy ra lỗi")
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