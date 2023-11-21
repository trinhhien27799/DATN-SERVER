
const Favorite = require('../../model/favorite')
const Product = require('../../model/product')
const Brand = require('../../model/brand')
const Variations = require('../../model/variations')
const Description = require('../../model/description')
const TypeProduct = require('../../model/typeProduct')

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
                await Promise.all([
                    (async () => {
                        const variations = await Variations.find({ productId: product._id, delete: false, quantity: { $gt: 0 } }).lean()
                        if (variations) {
                            variations.forEach((item) => {
                                delete item.productId
                                delete item.__v
                                delete item.delete
                            })
                            product.variations = variations
                        }
                    })(),
                    (async () => {
                        const type_product = await TypeProduct.findById(product.product_type_id)
                        if (type_product) {
                            product.product_type = type_product.name
                        }
                    })(),
                    (async () => {
                        if (!item.brand_id) {
                            return
                        }
                        const brand = await Brand.findById(product.brand_id)
                        if (brand) {
                            product.brand_name = brand.brand
                            product.brand_logo = brand.image
                        }
                    })(),
                    (async () => {
                        const description = await Description.find({ id_follow: product._id }).lean()
                        if (description) {
                            description.forEach((item) => {
                                delete item._id
                                delete item.id_follow
                                delete item.__v
                            })
                            product.description = description
                        }
                    })(),
                ])
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