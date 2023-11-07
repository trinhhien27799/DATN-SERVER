const mongoose = require('mongoose')
const Schema = mongoose.Schema



const Otp = new Schema({
    username: { type: String, require: true },
    otp: { type: String, require: true },
    type: { type: Number, require: true, default: 1 },
    confirm: { type: Boolean, default: false },
    time: { type: Date, default: Date.now, index: { expires: 240 } }
}, {
    collection: "Otp"
})

//type
// 1 dang ky
// 2 quen mat khau



module.exports = mongoose.model('Otp', Otp) 