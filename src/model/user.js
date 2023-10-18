const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const User = new Schema({
    fullname: { type: String, require: true },
    avatar: { type: String, default: "https://firebasestorage.googleapis.com/v0/b/shopping-6b085.appspot.com/o/user%2Fuser.png?alt=media&token=794ad4dc-302b-4708-b102-ccbaf80ea567&_gl=1*e1jpw6*_ga*NDE5OTAxOTY1LjE2OTUwMDQ5MjM.*_ga_CW55HF8NVT*MTY5NzExMzA0MS4yMS4xLjE2OTcxMTMzMjcuNTkuMC4w" },
    role: { type: Boolean, default: false },
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    enable: { type: Boolean, default: true },
    rewardPoints: { type: Number, default: 0 },
    default_address: { type: Object }
}, {
    collection: "User"
});



module.exports = mongoose.model('User', User);