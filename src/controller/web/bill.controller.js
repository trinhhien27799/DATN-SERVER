const Bill = require("../../model/bill");

require("dotenv").config;

const SECRECT = process.env.SECRECT;

class Controller {
  async list(req, res) {
    try {
      const array = await Bill.find();
      res.render("bill/viewBill", { layout: "layouts/main", data: array });
    } catch (error) {
      res.json(error);
    }
  }

  async detail(req, res) {
    try {
      const data = await Bill.findById({ _id: req.params.id });
      res.render("bill/detailBill", { layout: "layouts/main", data: data });
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = new Controller();
