const express = require('express')
const db = require('./src/config/db')
const router = require('./src/route')
require('dotenv').config()
const path = require('path')
const ejsLayout = require('express-ejs-layouts')


db.connect()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'src/public')));


// view engine setup
app.use(ejsLayout)
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');
app.set('layout', path.join(__dirname, 'src/views/layouts'));







const PORT = process.env.PORT | 3000

router(app)




app.listen(PORT, () => {
    console.log(`>>> Gửi otp  POST {username: String,forgotPassword:boolean }  
        http://localhost:${PORT}/api/user/receive-otp`)

    console.log(`>>> Xác nhận otp  POST {username: String, otp:String }
        http://localhost:${PORT}/api/user/verify-otp`)

    console.log(`>>> Tạo tài khoản  POST {username: String, password:String,fullname:String }
        http://localhost:${PORT}/api/user/create-account`)

    console.log(`>>> Đăng nhập bằng token  POST {token: String}
        http://localhost:${PORT}/api/user/auto-login`)

    console.log(`>>> Quên mật khẩu  POST {username: String,password: String}
        http://localhost:${PORT}/api/user/forgot-password`)


})




