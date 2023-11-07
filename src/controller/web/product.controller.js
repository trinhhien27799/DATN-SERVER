const Product = require("../../model/product")
const Variations = require("../../model/variations")
const Description = require("../../model/description")
const Banner = require("../../model/news")
const { uploadImage, deleteImage } = require('../../utils/uploadImage')

class Controller {
  async pageHome(req, res) {
    try {
      const array = await Product.find({}).sort({ time: -1 })
      res.render('product/viewProduct.ejs', { layout: 'layouts/main', data: array })
    } catch (error) {
      res.json(error)
    }
  }

  async detailProduct(req, res) {
    const id = req.params.id
    try {
      const product = await Product.findById(id)
      if (!product) {
        throw 'Đã xảy ra lỗi'
      }
      res.render('product/detailProduct.ejs', { layout: 'layouts/main', product })
    } catch (error) {
      res.json({ code: 500, message: error })
    }
  }

  pageNewProduct(req, res) {
    res.render('product/newProduct.ejs', { layout: './layouts/main' })
  }

  newProduct(req, res) {
    const body = req.body
    console.log(body)
    Product.create(body)
      .then((rs) => {
        console.log(rs)
        res.redirect('/product')
      })
      .catch((err) => res.json(err))
  }


  async deleteProduct(req, res) {
    const id = req.params.id
    try {
      const product = await Product.findByIdAndDelete(id)
      if (!product) {
        throw 'Product not found!'
      }
      const variations = await Variations.find({ productId: id })
      if (variations && variations.length > 0) {
        for (let item of variations) {
          deleteImage(item.image)
        }
        await Variations.deleteMany({ productId: id })
      }
      console.log("Delete product successful")
      res.redirect('/product')
    } catch (error) {
      console.log(error)
      res.json(error)
    }
  }

  async updateProduct(req, res) {
    const body = req.body
    const id = req.params.id
    console.log(id)
    try {
      const update = await Product.findOneAndUpdate({ _id: id }, { $set: body })
      console.log(update)
      if (!update) {
        throw ""
      }
      res.redirect(`/product`)
    } catch (error) {
      console.log(error)
      res.json(error)
    }
  }

  async addDescription(req, res) {
    const data = req.body
    const id = req.params.id
    try {
      const product = await Product.findById(id)
      if (!product) {
        const banner = await Banner.findById(id)
        if (!banner) {
          throw "Không tìm id tương ứng"
        }
      }

      if (req.file != null) {
        const filename = req.file.filename
        const filepath = req.file.path
        const url = await uploadImage(filepath, filename)
        data.image = url
      }

      if (data.title.length == 0 && data.description.length == 0 && !data.image) {
        throw "Không thể tạo dữ liệu trống"
      }
      data.id_follow = id
      const description = await Description.create(data)
      if (!description) {
        throw "Thêm mô tả thất bại"
      }
      res.redirect(`/product/description/${id}`)
    } catch (error) {
      console.log(error)
      res.json(error)
    }
  }

  async deleteDescription(req, res) {
    const id_product = req.params.id_product
    const id_description = req.params.id_description

    try {
      const product = await Product.findOne({ _id: id_product })
      if (!product) {
        throw "Không tìm thấy sản phẩm"
      }

      for (let i = 0; i < product.description.length; i++) {
        if (product.description[i]._id == id_description) {
          product.description.slice(i, 1)
          break
        }
      }
      await product.save()
      // res.json(product.description)
      res.redirect(`/home/product/${id_product}`)
    } catch (error) {
      console.log(error)
      res.json({ code: 500, message: "Đã xảy ra lỗi" })
    }
  }

  async pageVariations(req, res) {
    const productId = req.params.id
    try {
      const data = await Variations.find({ productId: productId }).sort({ _id: -1 })
      res.render('product/variations.ejs', { layout: './layouts/main', data, productId: productId })
    } catch (error) {
      res.json(error)
    }

  }

  pageNewVariations(req, res) {
    const productId = req.params.id
    res.render('product/newVariations.ejs', { layout: './layouts/main', productId: productId })
  }

  async NewVariations(req, res) {
    const data = req.body
    const productId = req.params.id
    data.productId = productId

    try {
      if (!req.file) {
        throw "e1"
      }
      const filename = req.file.filename
      const filepath = req.file.path
      const url = await uploadImage(filepath, filename)
      console.log("url " + url)
      data.image = url
      const variations = await Variations.create(data)
      if (!variations) {
        throw ""
      }
      const product = await Product.findById(productId)
      if (!product) {
        throw ""
      }

      if (!product.min_price) {
        product.min_price = data.price

      } else {
        if (product.min_price > data.price) {
          product.min_price = data.price

        }
      }
      if (!product.max_price) {
        product.max_price = data.price

      } else {
        if (product.max_price < data.price) {
          product.max_price = data.price

        }
      }
      if (!product.image_preview) {
        product.image_preview = data.image

      }
      product.total_quantity += variations.quantity



      await product.save()

      res.redirect(`/product/${productId}/variations`)
    } catch (error) {
      console.log(error)
      res.json(error)
    }

  }


  async pageDescription(req, res) {
    const id = req.params.id
    try {
      const descriptions = await Description.find({ id_follow: id })
      if (!descriptions) {
        throw "Không lấy được mô tả sản phẩm"
      }
      res.render('description/description.ejs', { layout: './layouts/main', id_follow: id, descriptions: descriptions })
    } catch (error) {
      console.log(error)
      res.json(error)
    }
  }

  async deleteVariations(req, res) {
    const id = req.params.id
    const product_id = req.params.product_id
    console.log(id)
    try {
      const variation = await Variations.findByIdAndRemove(id)
      if (!variation) {
        throw "Variations not found!"
      }
      res.redirect(`/product/${product_id}/variations`)
    } catch (error) {
      console.log(error)
      res.json(error)
    }
  }
}

module.exports = new Controller; 
