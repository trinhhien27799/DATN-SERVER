
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
            const favorite = await Favorite.findOne({ username: username }).lean()
            if (!favorite) {
                throw "Không tìm thấy danh sách yêu thích"
            }
            for (let i = 0; i < favorite.list_id_product.length; i++) {
                if (favorite.list_id_product[i] === id_product) {
                    delete favorite.list_id_product[i]
                    break
                }
            }
            res.json({ code: 200, message: "Xóa dữ liệu thành công", id_delete: id_product })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Đã xảy ra lỗi" })
        }
    }
}









module.exports = new ApiController;