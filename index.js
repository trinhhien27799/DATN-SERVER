const express = require('express')
const db = require('./src/config/db')
const router = require('./src/route')
require('dotenv').config()
var path = require('path');
var userRoute = require('./src/route/web/user.web.route');


db.connect()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'src/public')));


app.get('/login',(req,res)=>{
    res.render('auth/login.ejs');
})

app.get('/register',(req,res)=>{
    res.render('auth/register.ejs');
})

app.use('/user', userRoute);


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




