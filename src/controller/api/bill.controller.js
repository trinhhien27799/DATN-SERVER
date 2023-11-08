
const Product = require('../../model/product')
const Bill = require('../../model/bill')
const Cart = require('../../model/cart')
const Voucher = require('../../model/voucher')

class ApiController {
    async createBill(req, res) {
        try {
            
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