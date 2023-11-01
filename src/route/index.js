

//route api
const userApi = require('./api/user.route')
const productApi = require('./api/product.route')
const billApi = require('./api/bill.route')
const cartApi = require('./api/cart.route')
const favoriteApi = require('./api/favorite.route')
const bannerApi = require('./api/banner.route')
const newsApi = require('./api/news.route')
const notiApi = require('./api/notification.route')
const voucherApi = require('./api/voucher.route')

//route web
const userWeb = require('./web/user.route')
const productWeb = require('./web/product.route')
const billWeb = require('./web/bill.route')



function route(app) {

    //api

    app.use('/api/user', userApi) // tài khoản
    app.use('/api/product', productApi) //sản phẩm
    app.use('/api/bill', billApi) //hóa đơn
    app.use('/api/cart', cartApi)//giỏ hàng
    app.use('/api/favorite', favoriteApi) //yêu thích
    app.use('/api/banner', bannerApi) // banner
    app.use('/api/news', newsApi) // banner
    app.use('/api/notification', notiApi) // thông báo
    app.use('/api/voucher', voucherApi) // voucher

    //web

    app.get('/', (req, res) => {
        res.redirect('/user/login')
    })



    app.use('/user', userWeb)
    app.use('/home', productWeb)
    app.use('/bill', billWeb)

}

module.exports = route