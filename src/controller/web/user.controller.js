const User = require("../../model/user");
const Product = require("../../model/product");
const Bill = require("../../model/bill");
const Otp = require("../../model/otp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { sendEmail } = require("../../utils/emailSender");
const { uploadImage, deleteImage } = require('../../utils/uploadImage')


require("dotenv").config;

const SECRECT = process.env.SECRECT;

class Controller {
  pageLogin(req, res) {
    res.render("auth/login.ejs", { layout: "layouts/auth", data: null });
  }

  pageRegister(req, res) {
    res.render("auth/register.ejs", {
      layout: "layouts/auth",
      email: null,
      error: null,
      fullname: null,
      password: null,
    });
  }

  async login(req, res) {
    const data = req.body;

    try {
      const user = await User.findOne({ username: data.username, role: true });
      if (!user) {
        throw "Username not found";
      }
      const hashPassword = user.password;
      const matches = await bcrypt.compare(data.password, hashPassword);
      if (!matches) {
        throw "Username or password invalid";
      }

      user.password = null;
      const token = await jwt.sign(
        { username: user.username, password: user.password, role: user.role },
        SECRECT
      );
      res.redirect("/product");
    } catch (error) {
      data.error = error;
      console.log(data);
      res.render("auth/login.ejs", {
        layout: "layouts/auth",
        data: data,
      });
    }
  }

  async sendOtp(req, res) {
    const email = req.params.email;
    try {
      const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      const isEmail = emailPattern.test(email);
      if (!isEmail) {
        throw "Email invalid!";
      }
      const check = await User.findOne({ username: email });
      if (check) {
        throw "Email already exists!";
      }
      const num = await otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      const salt = await bcrypt.genSalt(10);
      const subject = "Xác nhận email";
      const text = `Mã xác nhận của bạn là ${num}`;
      sendEmail(email, subject, text);
      const otp = await bcrypt.hash(num, salt);
      await Otp.create({ username: email, otp: otp });
      res.render("auth/register.ejs", {
        layout: "layouts/auth",
        email: email,
        error: null,
        fullname: null,
        password: null,
      });
    } catch (error) {
      console.log(error);
      res.render("auth/register.ejs", {
        layout: "layouts/auth",
        email: email,
        error: error,
        fullname: null,
        password: null,
      });
    }
  }

  async register(req, res) {
    const body = req.body;
    console.log(body);
    const otp = body.code;
    delete body.code;
    try {
      const otpHolder = await Otp.findOne({ username: body.username }).sort({ time: -1})
      if (!otpHolder) {
        throw "OTP authentication failed!";
      }
      if (otpHolder.length == 0) {
        throw "Please verify your email before registering";
      }
      const hashOtp = otpHolder.otp;
      const matches = await bcrypt.compare(otp, hashOtp);
      if (!matches) {
        throw "OTP not correct!";
      }
      await Otp.deleteMany({ username: body.username });
      body.role = true;
      const salt = await bcrypt.genSalt(10);
      const password = body.password;
      const hashPass = await bcrypt.hash(password, salt);
      body.password = hashPass;
      await User.create(body);
      res.render("auth/register.ejs", {
        layout: "layouts/auth",
        email: null,
        error: "Register successful",
        fullname: null,
        password: null,
      });
    } catch (error) {
      console.log(error);
      res.render("auth/register.ejs", {
        layout: "layouts/auth",
        email: body.username,
        error: error,
        fullname: body.fullname,
        password: body.password,
      });
    }
  }

  async list(req, res) {
    try {
      const array = await User.find().sort({ time: -1 });
      res.render("user/viewUser", { layout: "layouts/main", data: array });
    } catch (error) {
      res.json(error);
    }
  }

  async detail(req, res) {
    try {
      const data = await User.findById({ _id: req.params.id });
      res.render("user/detailUser", { layout: "layouts/main", data: data });
    } catch (error) {
      res.json(error);
    }
  }

  async insert(req, res) {
    if (req.method == "POST") {
      const body = req.body;
      const salt = await bcrypt.genSalt(10);
      const password = body.password;
      const hashPass = await bcrypt.hash(password, salt);
      body.password = hashPass;
      body.avatar = "https://s.net.vn/za1l";
      await User.create(body);
      return res.redirect("/user");
    }
    res.render("user/addUser", { layout: "layouts/main" });
  }

  async edit(req, res) {
    const id = req.params.id;
    const data = await User.findById({ _id: req.params.id });

    res.render("user/editUser", {
      layout: "layouts/main",
      data,
    });
  }

  async editPost(req, res) { }

  async delete(req, res) {
    const id = req.params.id;

    await User.findByIdAndDelete(id)
      .then((user) => {
        if (!user) {
          throw "User not found!";
        }
        // deleteImage(user.avatar);
        res.redirect("/user");
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  }

  async dashboard(req, res) {
    try {
      let listProduct = await Product
        .find()
        .sort({ sold: -1 })
        .limit(5);
      const months = [];
      const totalBills = [];
      const totalBillsProduct = [];
      const totalInterests = [];
      const totalCustomers = [];
      const endDate = new Date();
      const last6Month = new Date(
        endDate.getFullYear(),
        endDate.getMonth() - 5,
        1
      );
      let currentDate = new Date(last6Month);
  
      while (currentDate <= endDate) {
        let previusDate = currentDate.toISOString();
        let nowDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          1
        ).toISOString();
        let date = currentDate.toLocaleString("en", {
          month: "long",
          year: "numeric",
        });
        months.push(date.substring(0, 1).toLocaleUpperCase() + date.substring(1));
        currentDate.setMonth(currentDate.getMonth() + 1);
  
        let total = await getTotalBill(previusDate, nowDate);
        let product = await getTotalProduct(previusDate, nowDate);
        let client = await getTotalCustomer(previusDate, nowDate);
        totalBills.push(total);
        totalBillsProduct.push(0 - product);
        totalInterests.push(total - product);
        totalCustomers.push(client);
      }
    

      res.render("dashBoard/dashboard", {
        layout: "layouts/main",
        title: "Dashboard",
        listProduct: JSON.stringify(listProduct),
        months: JSON.stringify(months),
        totalBills: JSON.stringify(totalBills),
        totalBillsProduct: JSON.stringify(totalBillsProduct),
        totalInterests: JSON.stringify(totalInterests),
        totalCustomers: JSON.stringify(totalCustomers),

      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
   }
}

async function getTotalBill(previusDate, nowDate) {
  var match_stage = {
    $match: {
      time: {
        $gte: new Date(previusDate),
        $lte: new Date(nowDate),
      },
      status: {
        $gte: 2
      }
    },
  };
  var group_stage = {
    $group: { _id: null, sum: { $sum: "$total_price" } },
  };
  var project_stage = {
    $project: { _id: 0, total: "$sum" },
  };

 
  var pipeline = [match_stage, group_stage, project_stage];
  let sumTotal = await Bill.aggregate(pipeline);
  if (sumTotal[0] != undefined) {
    return sumTotal[0].total;
  } else {
    return 0;
  }
}

async function getTotalProduct(previusDate, nowDate) {
  var match_stage = {
    $match: {
      time: {
        $gte: new Date(previusDate),
        $lte: new Date(nowDate),
      },
      status: {
        $gte: 2
      }
    },
  };
  var group_stage = {
    $group: { _id: null, sum: { $sum: "$import_total" } },
  };
  var project_stage = {
    $project: { _id: 0, total: "$sum" },
  };

  var pipeline = [match_stage, group_stage, project_stage];
  let sumTotal = await Bill.aggregate(pipeline);
  if (sumTotal[0] != undefined) {
    return sumTotal[0].total;
  } else {
    return 0;
  }
}

async function getTotalCustomer(previusDate, nowDate) {
  let listClient = await User.find({
    time: {
      $gte: previusDate,
      $lte: nowDate,
    }
  });
  if (listClient) {
    return listClient.length;
  } else {
    return 0;
  }
}




module.exports = new Controller();
