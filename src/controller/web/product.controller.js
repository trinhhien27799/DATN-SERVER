const Product = require("../../model/product")
const { uploadImage, deleteImage } = require('../../utils/uploadImage')

class Controller {
  async pageHome(req, res) {
    try {
      const array = await Product.find({})
      res.render('product/viewProduct.ejs', { layout: 'layouts/main', data: array })
    } catch (error) {
      res.json(error)
    }
  }

  async detailProduct(req, res) {
    const id = req.params.id
    try {
      const product = await Product.findById(id)
      console.log(product)
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
    Product.create(body)
      .then((rs) => {
        console.log(rs)
        res.redirect('/home/product')
      })
      .catch((err) => res.json(err))
  }

  async putOption(req, res) {
    const id = req.params.id
    const body = req.body
    var options = body.options
    delete body.options
    body.increase_price = +body.increase_price

    if (req.file != null && req.file != undefined) {
      const filename = req.file.filename;
      const filepath = req.file.path;
      const url = await uploadImage(filepath, filename);
      body.image = url;
    }

    console.log(body)
    try {
      var product = await Product.findById(id)
      if (!product) {
        throw 'Product not found!'
      }
      if (options === 'colors') {
        product.options.colors.push(body)
        if (product.options.colors.length == 1) {
          product.image_preview = body.image
        }
      } else if (options === 'rams') {
        product.options.rams.push(body)
      } else {
        product.options.roms.push(body)
      }
      await product.save()
      res.redirect(`/home/product/${product._id}`)
    } catch (err) {
      console.log(err)
      res.json(err)
    }
  }

  deleteProduct(req, res) {
    const id = req.params.id
    Product.findByIdAndDelete(id)
      .then((product) => {
        if (!product) {
          throw 'Product not found!'
        }
        console.log("Delete product successful")
        for (let i = 0; i < product.options.colors.length; i++) {
          deleteImage(product.options.colors[i].image)
        }
        res.redirect('/home/product')
      })
      .catch((err) => {
        console.log(err)
        res.json(err)
      })
  }

  updateProduct(req, res) {
    const body = req.body
    body.default_price = +body.default_price
    console.log(body)
    const id = req.params.id
    console.log(id)
    Product.findOneAndUpdate({ _id: id }, { $set: body })
      .then((rs) => {
        res.redirect(`/home/product/${id}`)
      })
      .catch((err) => {
        console.log(err)
        res.json(err)
      })
  }
}

module.exports = new Controller; 
