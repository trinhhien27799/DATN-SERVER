const Noti = require("../../model/notification");
const { uploadImage, deleteImage } = require("../../utils/uploadImage");

class Controller {
  async list(req, res) {
    try {
      const data = await Noti.find();
      res.render("notification/viewNoti", { layout: "layouts/main", data });
    } catch (error) {
      res.json(error);
    }
  }

  async detail(req, res) {
    try {
      const data = await Noti.findById({ _id: req.params.id });
      res.render("notification/detailNoti", { layout: "layouts/main", data });
    } catch (error) {
      res.json(error);
    }
  }

  async insert(req, res) {
    if (req.method == "POST") {
      try {
        const body = req.body;

        if (req.file != null && req.file != undefined) {
          const filename = req.file.filename;
          const filepath = req.file.path;
          const url = await uploadImage(filepath, filename);
          body.image = url;
        }
  
        await Noti.create(body);
        return res.redirect("/brand");
      } catch (error) {
        console.log(error);
      }
     
    }
    res.render("brand/addBrand", { layout: "layouts/main" });
  }

  async edit(req, res) {
    const data = await Noti.findById({ _id: req.params.id });

    res.render("brand/editBrand", {
      layout: "layouts/main",
      data,
    });
  }

  async editPost(req, res) {
    let { brand, description, image, _id, img } = req.body;

    if (req.file != null && req.file != undefined) {
      await deleteImage(img);
      const filename = req.file.filename;
      const filepath = req.file.path;
      const url = await uploadImage(filepath, filename);
      image = url;
    }
  
    await Noti.findByIdAndUpdate(_id,{
      brand: brand,
      description : description,
      image: image
    });
  
    res.redirect('/brand');
  }

  async delete(req, res) {
     const id = req.params.id;

    await Noti.findByIdAndDelete(id)
      .then((brand) => {
        if (!brand) {
          throw "Brand not found!";
        }
        deleteImage(brand.image);
        res.redirect("/brand");
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  }
}

module.exports = new Controller();
