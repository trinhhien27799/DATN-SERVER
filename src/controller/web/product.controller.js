const User = require("../../model/user")

class Controller {
  pageHome(req, res) {
    res.render('product/viewProduct.ejs')
  }
}

module.exports = new Controller; 
