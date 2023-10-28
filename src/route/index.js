

//route api
const userApi = require('./api/user.route')
const productApi = require('./api/product.route')
const billApi = require('./api/bill.route')
const cartApi = require('./api/cart.route')
const favoriteApi = require('./api/favorite.route')
const bannerApi = require('./api/banner.route')
const newsApi = require('./api/news.route')

//route web
var userWeb = require('./web/user.route');
var productWeb = require('./web/product.route');
var billWeb = require('./web/bill.route');


const Brand = require('../model/brand')

function route(app) {

    //api

    app.use('/api/user', userApi) // tài khoản
    app.use('/api/product', productApi) //sản phẩm
    app.use('/api/bill', billApi) //hóa đơn
    app.use('/api/cart', cartApi)//giỏ hàng
    app.use('/api/favorite', favoriteApi) //yêu thích
    app.use('/api/banner', bannerApi) // banner
    app.use('/api/news', newsApi) // banner


    //web

    app.get('/', (req, res) => {
        res.redirect('/user/login')
    })

    app.post('/brand', (req, res) => {
       const id = req.body.id
       const image = req.body.image
       Brand.findByIdAndUpdate(id,{$set:{image:image}}).then(rs=>res.json(rs)).catch(er=>res.json(er))
    })

    app.use('/user', userWeb)
    app.use('/home', productWeb)
    app.use('/bill', billWeb)

}

module.exports = route