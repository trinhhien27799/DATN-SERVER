const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const User = new Schema({
    fullname: { type: String, require: true },
    avatar: { type: String, default:"https://firebasestorage.googleapis.com/v0/b/shopping-6b085.appspot.com/o/user.png?alt=media&token=dfc349ae-aeef-4e97-ad0b-7d30e0b29135"},
    role: { type: Boolean, default: false },
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    enable: { type: Boolean, default: true },
    rewardPoints: { type: Number, default: 0 }
}, {
    collection: "User"
});



module.exports = mongoose.model('User', User);