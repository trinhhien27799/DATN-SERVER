const mongoose = require('mongoose')
const Schema = mongoose.Schema



const Description = new Schema({
    id_follow: { type: String, require: true },
    title: { type: String },
    description: { type: String },
    image: { type: String }
}, {
    collection: "Description"
})



module.exports = mongoose.model('Description', Description) 