
const Favorite = require('../../model/favorite')
const Product = require('../../model/product')


class ApiController {
    async add(req, res) {
        const username = req.body.username
        const product_id = req.body.product_id
        try {
            const favoriteFind = await Favorite.findOne({ username: username, product_id: product_id })
            if (favoriteFind) {
                throw "Sản phẩm đã tồn tại trong danh sách yêu thích"
            }
            const favorite = await Favorite.create({ username: username, product_id: product_id })
            if (!favorite) {
                throw "Thêm danh sách yêu thích thất bại"
            }
            res.json({ code: 200, message: "Thêm sản phẩm yêu thích thành công" })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Thêm sản phẩm yêu thích thất bại" })
        }
    }

    async getAll(req, res) {
        const username = req.body.username
        try {
            const favorite = await Favorite.find({ username: username })
            if (!favorite) {
                throw "Không tìm thấy bản ghi danh sách yêu thích"
            }
            var list_favorite = []
            await Promise.all(favorite.map(async (item) => {
                let product = await Product.find({ _id: item.product_id, delete: false }).lean()
                if (product) list_favorite.push(product)
            }))
            res.json(list_favorite)
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

    async delete(req, res) {
        const username = req.body.username
        const product_id = req.body.product_id
        try {
            const favorite = await Favorite.findOneAndDelete({ username: username, product_id: product_id })
            if (!favorite) {
                throw "Không tìm thấy danh sách yêu thích"
            }
            res.json({ code: 200, message: "Xóa dữ liệu thành công" })
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

    async check(req, res) {
        const username = req.body.username
        const product_id = req.body.product_id
        try {
            const favorite = await Favorite.findOne({ username: username, product_id: product_id })
            res.json(!(!favorite))
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }
}









module.exports = new ApiController;