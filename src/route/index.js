

//route api
const userApi = require('./api/user.route')
const productApi = require('./api/product.route')
const billApi = require('./api/bill.route')
const cartApi = require('./api/cart.route')


//route web
var userWeb = require('./web/user.route');
var homeWeb = require('./web/home.route');




function route(app) {

    //api

    app.use('/api/user', userApi)
    app.use('/api/product', productApi)
    app.use('/api/bill', billApi)
    app.use('/api/cart', cartApi)

    //web

    app.get('/', (req, res) => {
        res.redirect('/user/login')
    })

    app.use('/user', userWeb)
    app.use('/home', homeWeb)

}

module.exports = route