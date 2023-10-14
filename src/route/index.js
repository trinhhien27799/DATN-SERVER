

//route api
const userApi = require('./api/user.route')
const productApi = require('./api/product.route')

//route web
var userWeb = require('./web/user.route');
var homeWeb = require('./web/home.route');




function route(app) {

    //api

    app.use('/api/user', userApi)
    app.use('/api/product', productApi)
    //web

    app.get('/', (req, res) => {
        res.redirect('/user/login')
    })

    app.use('/user', userWeb)
    app.use('/home', homeWeb)

}

module.exports = route