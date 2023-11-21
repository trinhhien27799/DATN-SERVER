const Bill = require("../../model/bill");
const Cache = require('../../model/Cache');
const Variations = require("../../model/variations");
require("dotenv").config;


class Controller {
  async list(req, res) {
    try {
      const array = await Bill.find();

      for (let i = 0; i < array.length; i++) {

        if (array[i].status != undefined) {
          switch (array[i].status) {
            case 0:
              array[i].statusText = "Unconfimred"
              break;
            case 1:
              array[i].statusText = "Delivering"
              break;
            case 2:
              array[i].statusText = "Delivered"
              break;
            case 3:
              array[i].statusText = "Received"
              break;
            default:
              break;
          }
        }
      }
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

  async confirmBill(req, res) {
    try {
      const id = req.params.id;
      const bill = await Bill.findById(id);
      console.log(bill)
      if (!bill) throw "Không tìm thấy hóa đơn"
      bill.status += 1;
      await bill.save();
      res.redirect('/bill');
      await Promise.all(bill.products.map(async (item) => {
        const cacheCheck = await Cache.findOne({ username: bill.username, varitationId: item.variations_id })
        if (cacheCheck) {
          await cacheCheck.deleteOne()
          await Cache.create(cacheCheck)
        } else {
          const variations = await Variations.findById(item.variations_id)
          await Cache.create({ username: bill.username, productId: variations.productId, varitationId: item.variations_id })
        }
      }))
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = new Controller();
