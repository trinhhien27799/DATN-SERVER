
const User = require('../../model/user')
const Bill = require('../../model/bill')
const Cart = require('../../model/cart')

class ApiController {
    async createBill(req, res) {
        const data = req.body
        console.log("k", data)
        delete data.address._id
        try {
            if (data.products.length == 0) {
                throw "Danh sách sản phẩm không được để trống"
            }
            let total_price = 0
            let list_id_cart = []
            for (let i = 0; i < data.products.length; i++) {
                let price_product = data.products[i].default_price
                list_id_cart.push(data.products[i]._id)
                delete data.products[i]._id
                delete data.products[i].default_price
                if (data.products[i].color_product) {
                    price_product += data.products[i].color_product.increase_price
                    data.products[i].image_product = data.products[i].color_product.image
                    data.products[i].color_product = data.products[i].color_product.color
                }
                if (data.products[i].ram_product) {
                    price_product += data.products[i].ram_product.increase_price
                    data.products[i].ram_product = data.products[i].ram_product.size
                }
                if (data.products[i].rom_product) {
                    price_product += data.products[i].rom_product.increase_price
                    data.products[i].rom_product = data.products[i].rom_product.size
                }
                data.products[i].price_product = price_product * data.products[i].quantity
                total_price += data.products[i].price_product
            }
            data.total_price = total_price
            const bill = await Bill.create(data)
            if (!bill) {
                throw "Đã xảy ra lỗi"
            }
            await Cart.deleteMany({ _id: list_id_cart })
            res.json({ code: 200, message: "Đơn hàng của bạn đã tồn tại trên hệ thống" })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: error })
        }
    }

    async getAll(req, res) {
        const username = req.body.username
        const status = req.params.status
        try {
            const bills = await Bill.find({ username: username, status: status })
            if (!bills) {
                throw ""
            }
            res.json({ code: 200, message: "Lấy dữ liệu thành công", bills })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Đã xảy ra lỗi" })
        }
    }

    async cancelBill(req, res) {
        const id_bill = req.body.id_bill
        const username = req.body.username
        const cancel_order = req.body.cancel_order
        try {
            const bill = await Bill.findOne({ username: username, _id: id_bill })
            if (!bill) {
                throw ""
            }
            bill.status = 4
            bill.cancel_order = cancel_order
            await bill.save()
            res.json({ code: 200, message: "Hủy đơn thành công" })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Đã xảy ra lỗi" })
        }
    }
}









module.exports = new ApiController;