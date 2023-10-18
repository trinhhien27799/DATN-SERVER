require('dotenv').config()
const User = require('../../model/user')
const Otp = require('../../model/otp')
const Address = require('../../model/address')
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRECT = process.env.SECRECT
const { sendEmail } = require('../../utils/emailSender')
const { uploadImage, deleteImage } = require('../../utils/uploadImage')
const { json } = require('express')

class ApiController {
    async insertOtp(req, res) {
        const username = req.body.username
        const forgotPassword = req.body.forgotPassword
        try {
            if (forgotPassword == 'false' || forgotPassword == false) {
                const user = await User.findOne({ username: username })

                if (user) {
                    res.json({ code: 409, message: "Tài khoản này đã tồn tại" })
                    return
                }
            }
            const num = await otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            const salt = await bcrypt.genSalt(10)
            const otp = await bcrypt.hash(num, salt)
            const numberPhonePattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
            const isNumberPhone = numberPhonePattern.test(username)
            if (isNumberPhone) {
                // gửi otp sms 
                throw "Hãy đăng ký bằng email"

            } else {
                const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
                const isEmail = emailPattern.test(username)
                if (isEmail) {
                    const subject = "Xác nhận email"
                    const text = `Mã xác nhận của bạn là ${num}`
                    sendEmail(username, subject, text)
                } else {
                    throw "Tài khoản không hợp lệ"
                }
            }
            const rs = await Otp.create({ username: username, otp: otp })
            res.json({ code: 200, message: "Tạo otp thành công" })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: error })
        }
    }

    async verifyOtp(req, res) {
        const username = req.body.username
        const otp = req.body.otp
        try {
            const otpHolder = await Otp.find({ username: username })
            if (!otpHolder.length) {
                return res.json({ code: 400, message: "Mã xác minh hết hạn" })
            }
            const hashOtp = otpHolder[otpHolder.length - 1].otp
            const matches = await bcrypt.compare(otp, hashOtp)
            if (matches) {
                await Otp.deleteMany({ username: username })
                return res.json({ code: 200, message: "Xác nhận mã thành công" })
            }
            res.json({ code: 404, message: "Mã xác minh không chính xác" })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Đã xảy ra lỗi" })
        }

    }


    async createAccount(req, res) {
        const account = req.body
        console.log(account)
        try {
            const username = account.username
            const userFind = await User.findOne({ username: username })
            if (userFind) {
                throw "Tài khoản đã tồn tại"
            }
            const salt = await bcrypt.genSalt(10)
            const password = account.password
            const hashPass = await bcrypt.hash(password, salt)
            account.password = hashPass
            const user = await User.create(account)
            res.json({ code: 200, message: "Tạo tài khoản thành công" })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Tạo tài khoản thất bại" })
        }

    }

    async login(req, res) {
        const username = req.body.username
        const password = req.body.password
        console.log(username, password)
        try {
            const user = await User.findOne({ username: username })
            if (!user) {
                throw "Tài khoản hoặc mật khẩu không chính xác"
            }
            if (user.role == true) {
                throw "Tài khoản không có quyền truy cập"
            }
            const hashPassword = user.password
            const matches = await bcrypt.compare(password, hashPassword)
            if (!matches) {
                throw "Tài khoản hoặc mật khẩu không chính xác"
            }
            user.password = null
            const token = await jwt.sign({ username: username, password: password, role: user.role }, SECRECT)
            res.json({ code: 200, message: "Đăng nhập thành công", user, token: token })
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

    async loginWithToken(req, res) {
        const token = req.body.token
        try {
            const account = await jwt.verify(token, SECRECT)
            const user = await User.findOne({ username: account.username })
            if (!user) {
                return res.json({ code: 404, message: "Token không hợp lệ" })
            }
            user.password = null
            res.json({ code: 200, message: "Đăng nhập thành công", user })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Đã xảy ra lỗi" })
        }
    }

    async forgotPassword(req, res) {
        const username = req.body.username
        const password = req.body.password
        try {
            const salt = await bcrypt.genSalt(10)
            const hashPass = await bcrypt.hash(password, salt)
            const update = await User.updateOne({ username: username }, { $set: { password: password } })
            res.json({ code: 200, message: "Cập nhật thành công" })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Đã xảy ra lỗi" })
        }
    }

    async addAddress(req, res) {
        const data = req.body
        const username = data.username
        try {
            const numberPhonePattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
            const isNumberPhone = numberPhonePattern.test(data.numberphone)
            if (!isNumberPhone) {
                throw "Số điện thoại không hợp lệ!"
            }
            const user = await User.findOne({ username: username })
            if (!user) {
                throw "Không tìm thấy username!"
            }
            const address = await Address.create(data)
            if (!user.default_address) {
                user.default_address = address
                await user.save()
            }
            res.json({ code: 200, message: "Thêm địa chỉ thành công", address: address })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: error })
        }

    }


    async getAddress(req, res) {
        const username = req.body.username
        try {
            const address = await Address.find({ username: username })
            console.log(address)
            if (!address) {
                throw "Đã xảy ra lỗi!"
            }
            res.json({ code: 200, data: address })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: error })
        }
    }

    async updateAddress(req, res) {
        const data = req.body
        try {
            const address = await Address.findById(data._id)
            if (!address) {
                throw "Không tìm thấy địa chỉ!"
            }
            await address.updateOne({ $set: data })
            const user = await User.findOne({ username: data.username })
            if (!user) {
                throw "Không tìm thấy thông tin người dùng"
            }

            if (data._id == user.default_address._id) {
                user.default_address = data
            }
            res.json({ code: 200, message: "Cập nhật địa chỉ thành công", data: { data } })

        } catch (error) {
            console.log(error)
            res.json({ code: 404, message: error })
        }
    }

    async deleteAddress(req, res) {
        const data = req.body
        try {
            const address = await Address.findById(data._id)
            if (!address) {
                throw "Không tìm thấy địa chỉ!"
            }
            await address.deleteOne()
            const user = await User.findOne({ username: data.username })
            if (!user) {
                throw "Không tìm thấy thông tin người dùng"
            }
            if (user.default_address._id == data._id) {
                const newAdress = await Address.findOne({ username: data.username })
                if (newAdress) {
                    user.default_address = newAdress
                    await user.save()
                }
            }
            res.json({ code: 200, message: "Xóa địa chỉ thành công" })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: error })
        }
    }

}









module.exports = new ApiController;