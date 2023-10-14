const Product = require("../../model/product")

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
        res.json(rs)
      })
      .catch((err) => res.json(err))
  }
}

module.exports = new Controller; 
