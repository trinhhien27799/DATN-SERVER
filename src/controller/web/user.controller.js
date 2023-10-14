const User = require("../../model/user")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

require('dotenv').config

const SECRECT = process.env.SECRECT

class Controller {
  pageLogin(req, res) {
    res.render('auth/login.ejs', { layout: 'layouts/auth' });
  }

  pageRegister(req, res) {
    res.render('auth/register.ejs', { layout: 'layouts/auth' });
  }


  async login(req, res) {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username: username, role: true });
      if (!user) {
        return res.render('auth/login.ejs', {
          layout: 'layouts/auth',
          data: {
            code: 404,
            message: "Tài khoản Không tồn tại",
          }
        })
      }
      const hashPassword = user.password;
      const matches = await bcrypt.compare(password, hashPassword);
      if (!matches) {
        return res.render('auth/login.ejs', {
          layout: 'layouts/auth',
          data: {
            code: 404,
            message: "Tài khoản hoặc mật khẩu không chính xác",
          }
        });
      }

      user.password = null
      const token = await jwt.sign({ username: username, password: password, role: user.role }, SECRECT)
      res.redirect('/home/product')
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  };
}

module.exports = new Controller; 
