require('dotenv').config()
const Product = require('../../model/product')
const { uploadImage, deleteImage } = require('../../utils/uploadImage')
const { json } = require('express')

class ApiController {
    async getAll(req, res) {
        try {
            const products = await Product.find({}).exec()
            res.json(products)
        } catch (error) {
            res.json({ code: 500, message: "error" })
        }

    }

    insert(req, res) {
        const body = req.body
        const { colors, rams, roms } = body.options

        let color_price = 0
        let ram_price = 0
        let rom_price = 0
        if (colors.length > 0) {
            for (let i = 0; i < colors.length; i++) {
                if (color_price < colors[i].increase_price) {
                    color_price = colors[i].increase_price
                }
            }
        }
        if (rams.length > 0) {
            for (let i = 0; i < rams.length; i++) {
                if (ram_price < rams[i].increase_price) {
                    ram_price = rams[i].increase_price
                }
            }
        }
        if (roms.length > 0) {
            for (let i = 0; i < roms.length; i++) {
                if (rom_price < roms[i].increase_price) {
                    rom_price = roms[i].increase_price
                }
            }
        }
        body.max_price = body.default_price + color_price + ram_price + rom_price
        Product.create(body)
            .then((rs) => res.json({ code: 200, message: "insert successful" }))
            .catch((e) => res.json({ code: 500, message: e }))
    }


}



// if (req.file != null && req.file != undefined) {
//     const filename = req.file.filename;
//     const filepath = req.file.path;
//     const url = await uploadImage(filepath, filename);
//     account.image = url;
// }





module.exports = new ApiController;