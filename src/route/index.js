const users = require('./api/user.route')
const products = require('./api/product.route')

function route(app) {
    app.get('/', (req, res) => {
        res.send('Hey this is my API running 🥳')
    });
    app.use('/api/user', users)
    app.use('/api/product', products)
}

module.exports = route