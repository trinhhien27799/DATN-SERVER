const mongoose = require('mongoose')
const Schema = mongoose.Schema



const Notification = new Schema({
    username: { type: String, require },
    title: { type: String, require: true },
    descrition: { type: String, require: true },
    image: { type: String, require: true },
    seen:{type:Boolean},
    time: { type: Date, default: Date.now, index: { expires: 2592000 } }
}, {
    collection: "Notification"
})



module.exports = mongoose.model('Notification', Notification) 