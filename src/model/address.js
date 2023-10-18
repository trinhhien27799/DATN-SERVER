const mongoose = require('mongoose')
const Schema = mongoose.Schema



const Address = new Schema({
    username: { type: String, require: true },
    fullname: { type: String, require: true },
    numberphone: { type: String, require: true },
    address: { type: String, require: true },

}, {
    collection: "Address"
})

module.exports = mongoose.model('Address', Address) 