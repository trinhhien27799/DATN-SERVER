
const Notification = require('../../model/notification')
 const { getIo } = require('../../config/socketManager')

class ApiController {
    async getAll(req, res) {
        const username = req.body.username
        try {
            const noti = await Notification.find({ username: username }).sort({ time: -1, seen: -1 })
            res.json(noti)
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

    async seenAll(req, res) {
        const username = req.body.username
        try {
            const noti = await Notification.updateMany({ username: username,seen:false },{$set:{seen:true}})
            res.json(noti)
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

    async delete(req, res) {
        const username = req.body.username
        const notificationId = req.body.notificationId
        try {
            const noti = await Notification.deleteOne({_id:notificationId})
            res.json(noti)
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

    async deleteAll(req, res) {
        const username = req.body.username
        try {
            const noti = await Notification.deleteMany({username:username})
            res.json(noti)
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }
}









module.exports = new ApiController;


// const io = getIo();
