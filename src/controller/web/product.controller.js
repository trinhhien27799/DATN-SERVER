const Product = require("../../model/product")
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
    body.max_price = body.default_price
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
      let color_price = 0
      let ram_price = 0
      let rom_price = 0

      for (let i = 0; i < product.options.colors.length; i++) {
        if (color_price < product.options.colors[i].increase_price) {
          color_price = product.options.colors[i].increase_price
        }
      }


      for (let i = 0; i < product.options.rams.length; i++) {
        if (ram_price < product.options.rams[i].increase_price) {
          ram_price = product.options.rams[i].increase_price
        }
      }


      for (let i = 0; i < product.options.roms.length; i++) {
        if (rom_price < product.options.roms[i].increase_price) {
          rom_price = product.options.roms[i].increase_price
        }
      }

      product.max_price = product.default_price + color_price + ram_price + rom_price
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

  async deleteOption(req, res) {
    const id_product = req.params.id_product
    const id_option = req.params.id_option
    const option = req.params.option
    console.log(id_product, option, id_option)
    try {
      const product = await Product.findOne({ _id: id_product })
      if (!product) {
        throw "Không tìm thấy sản phẩm"
      }
      if (option == "color") {
        for (let i = 0; i < product.options.colors.length; i++) {
          if (product.options.colors[i]._id == id_option) {
            console.log(product.options.colors[i])
            if (i == 0) {
              console.log("one")
              product.image_preview = product.options.colors[1].image
            }
            deleteImage(product.options.colors[i].image)
            product.options.colors = product.options.colors.filter(function (item) {
              return item._id != id_option
            })
          }
        }
      } else if (option == "ram") {
        for (let i = 0; i < product.options.rams.length; i++) {
          if (product.options.rams[i]._id == id_option) {
            console.log(product.options.rams[i])
            product.options.rams = product.options.rams.filter(function (item) {
              return item._id != id_option
            })
          }
        }
      } else {
        for (let i = 0; i < product.options.roms.length; i++) {
          if (product.options.roms[i]._id == id_option) {
            console.log(product.options.roms[i])
            product.options.roms = product.options.roms.filter(function (item) {
              return item._id != id_option
            })
          }
        }
      }
      await product.save()
      res.redirect(`/home/product/${id_product}`)
    } catch (error) {
      console.log(error)
      res.json({ code: 500, message: "Đã xảy ra lỗi" })
    }
  }
}

module.exports = new Controller; 
