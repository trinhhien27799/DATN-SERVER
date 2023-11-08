
const Product = require('../../model/product')
const Bill = require('../../model/bill')
const Cart = require('../../model/cart')
const Voucher = require('../../model/voucher')
const Variations = require('../../model/variations')

class ApiController {
    async createBill(req, res) {
        try {
            var data = req.body
            let total_price = 0
            data.proudutcs = []
            var productsUpdate = []
            var cartsDelete = []
            await Promise.all(data.list_cart.map(async (item) => {
                const variations_id = item.variations_id
                const variations = await Variations.findById(variations_id)
                if (!variations) {
                    throw "Không tìm thấy biến thể"
                }
                if (variations.quantity < 1) {
                    throw "Số lượng biến thể nhỏ hơn 1"
                }
                cartsDelete.push(item._id)
                const product = await Product.findById(variations.productId)
                if (!product) {
                    throw "Không tìm thấy sản phẩm"
                }
                data.product.push({
                    product_id: product._id,
                    product_name: product.product_name,
                    brand_name: product.brand_name,
                    color: variations.color,
                    image: variations.image,
                    ram: variations.ram,
                    rom: variations.rom,
                    price: variations.price,
                    quantity: item.quantity
                })
                productsUpdate.push(product)
                return total_price += item.quantity * variations.price * product.percent_discount

            }))

            // for (let item of data.list_cart) {

            //     const variations_id = item.variations_id
            //     const variations = await Variations.findById(variations_id)
            //     if (!variations) {
            //         throw "Không tìm thấy biến thể"
            //     }
            //     if (variations.quantity < 1) {
            //         throw "Số lượng biến thể nhỏ hơn 1"
            //     }
            //     const product = await Product.findById(variations.productId)
            //     if (!product) {
            //         throw "Không tìm thấy sản phẩm"
            //     }
            //     data.product.push({
            //         product_id: product._id,
            //         product_name: product.product_name,
            //         brand_name: product.brand_name,
            //         color: variations.color,
            //         image: variations.image,
            //         ram: variations.ram,
            //         rom: variations.rom,
            //         price: variations.price,
            //         quantity: item.quantity
            //     })
            //     total_price += item.quantity * variations.price * product.percent_discount
            //     productsUpdate.push(product)
            // }
            if (data.voucher_id != null) {
                data.voucher = 0
                const voucher = await Voucher.findOne({ _id: data.voucher_id, username: data.username, used: false, expiration_date: { $gte: new Date() } })
                if (!voucher) {
                    throw "Voucher không hợp lệ"
                }

                if (voucher.type == 0) {
                    if (voucher.discount_type == 0) {
                        data.voucher = data.transport_fee - voucher.discount_value
                    } else {
                        data.voucher = data.transport_fee * voucher.discount_value / 100
                    }
                } else {
                    if (voucher.discount_type == 0) {
                        data.voucher = total_price - voucher.discount_value
                    } else {
                        data.voucher = total_price * voucher.discount_value / 100
                    }
                }
                total_price = total_price + data.transport_fee - data.voucher
                delete data.voucher_id
            } else {
                total_price += data.transport_fee
            }
            delete data.list_cart
            data.total_price = total_price
            const bill = await Bill.create(data)
            if (!bill) {
                throw "Tạo hóa đơn thất bại"
            }

            await Promise.all(productsUpdate.map(async (item) => {
                return item.updateOne({ $set: { total_quantity: item.total_quantity - 1 } })
            }))
            await Cart.deleteMany({ _id: { $in: cartsDelete } })
            res.json({ message: "Đơn hàng của bạn đã tồn tại trên hệ thống" })
        } catch (error) {
            console.log(error)
            res.json(error)
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