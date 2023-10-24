
const Favorite = require('../../model/favorite')
const Product = require('../../model/product')


class ApiController {
    async add(req, res) {
        const username = req.body.username
        const id_product = req.body.id_product
        try {
            const favorite = await Favorite.findOne({ username: username })
            if (!favorite) {
                const data = {
                    username: username,
                    list_id_product: [id_product]
                }
                await Favorite.create(data)
            } else {
                favorite.list_id_product.push(id_product)
                favorite.list_id_product = favorite.list_id_product.reduce((accumulator, currentValue) => {
                    if (!accumulator.includes(currentValue)) {
                        accumulator.push(currentValue)
                    }
                    return accumulator
                }, [])
                await favorite.save()
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
            const favorite = await Favorite.findOne({ username: username })
            if (!favorite) {
                throw "Không tìm thấy bản ghi danh sách yêu thích"
            }
            let list_favorite = await Product.find({ _id: { $in: favorite.list_id_product } }).lean()

            if (!list_favorite) {
                throw "Đã xảy ra lỗi"
            }

            for (let item of list_favorite) {
                delete item.description
                delete item.options
            }


            console.log(list_favorite)
            res.json({ code: 200, message: "Lấy dữ liệu thành công", list_favorite })

        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Đã xảy ra lỗi" })
        }
    }

    async delete(req, res) {
        const username = req.body.username
        const id_product = req.body.id_product
        try {
            const favorite = await Favorite.findOne({ username: username })
            if (!favorite) {
                throw "Không tìm thấy danh sách yêu thích"
            }
            favorite.list_id_product = favorite.list_id_product.filter((id) => id != id_product)
            await favorite.save()
            res.json({ code: 200, message: "Xóa dữ liệu thành công" })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Đã xảy ra lỗi" })
        }
    }

    async check(req, res) {
        const username = req.body.username
        const id_product = req.body.id_product
        try {
            const listFavorite = await Favorite.findOne({ username: username })
            if (!listFavorite) {
                res.json(false)
            } else {
                let boolean = false
                for (let fav of listFavorite.list_id_product) {
                    if (id_product == fav) {
                        boolean = true
                        break
                    }
                }
                res.json(boolean)
            }
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Đã xảy ra lỗi" })
        }
    }
}









module.exports = new ApiController;