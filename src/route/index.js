

//route api
const userApi = require('./api/user.route')
const productApi = require('./api/product.route')
const billApi = require('./api/bill.route')
const cartApi = require('./api/cart.route')
const favoriteApi = require('./api/favorite.route')

//route web
var userWeb = require('./web/user.route');
var productWeb = require('./web/product.route');
var billWeb = require('./web/bill.route');




function route(app) {

    //api

    app.use('/api/user', userApi)
    app.use('/api/product', productApi)
    app.use('/api/bill', billApi)
    app.use('/api/cart', cartApi)
    app.use('/api/favorite', favoriteApi)




    //web

    app.get('/', (req, res) => {
        res.redirect('/user/login')
    })

    app.use('/user', userWeb)
    app.use('/home', productWeb)
    app.use('/bill', billWeb)

}

module.exports = route