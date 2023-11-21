const Bill = require("../../model/bill");
const { login } = require("./user.controller");

require("dotenv").config;


class Controller {
  async list(req, res) {
    try {
    
      const array = await Bill.find({status: req.query.status});

      const amount = await Bill.find({status: 0});
      const amount2 = await Bill.find({status: 1});

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
            default:
              break;
          }
        }
      }
      res.render("bill/viewBill", { layout: "layouts/main", data: array, amount, amount2 });
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
  async confirmBill(req, res){
    try {
      const id = req.params.id;
      const bill = await Bill.findById(id);
      
      if (bill && bill.status == 0) {
        bill.status = 1;
        await Bill.findByIdAndUpdate(id, bill);
      }else if (bill && bill.status == 1) {
        bill.status = 2;
        await Bill.findByIdAndUpdate(id, bill);
      }

      res.redirect('/bill');
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = new Controller();
