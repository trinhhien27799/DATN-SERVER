const express = require('express')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const PORT = process.env.PORT | 3000
const db = require('./src/config/db')
const router = require('./src/route')

router(app)


db.connect()

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




