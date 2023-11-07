const Product = require("../../model/product");
const Brand = require("../../model/brand");
const { uploadImage, deleteImage } = require("../../utils/uploadImage");

class Controller {
  async pageHome(req, res) {
    try {
      const array = await Product.find({});
      array.forEach((product) => {
        delete product.description;
        product.product_name = `${product.product_name} (${product.rom})`;
      });
      res.render("product/viewProduct.ejs", {
        layout: "layouts/main",
        data: array,
      });
    } catch (error) {
      res.json(error);
    }
  }

  async editProduct(req, res) {
    const id = req.params.id;
    try {
      const product = await Product.findById(id);
      const arrBrand = await Brand.find();

      if (!product) {
        throw "Đã xảy ra lỗi";
      }
      res.render("product/editProduct.ejs", {
        layout: "layouts/main",
        product,
        arrBrand
      });
    } catch (error) {
      res.json({ code: 500, message: error });
    }
  }

  async pageNewProduct(req, res) {
    const arrBrand = await Brand.find();
    console.log(arrBrand);

    res.render("product/newProduct.ejs", { layout: "./layouts/main", arrBrand });
  }

  newProduct(req, res) {
    const body = req.body;
    Product.create(body)
      .then((rs) => {
        res.redirect(`/home/product/${rs._id}`);
      })
      .catch((err) => res.json(err));
  }

  async add_op(req, res) {
    
    res.render("product/add_op", { layout: "./layouts/main", id: req.params.id });
  }

  async add_op2(req, res) {

    const id = req.body.id;
    const product = await Product.findById(id);

    const body = req.body;
    delete body.id;
    body.product_name = product.product_name
    body.brand_name = product.brand_name

    console.log(body);

    Product.create(body)
    .then((rs) => {
      res.redirect(`/home/product/${rs._id}`);
    })
    .catch((err) => res.json(err));
    
   
  }

  async putOption(req, res) {
    const id = req.params.id;
    const body = req.body;
    delete body.options;
   
    if (req.file != null && req.file != undefined) {
      const filename = req.file.filename;
      const filepath = req.file.path;
      const url = await uploadImage(filepath, filename);
      body.image = url;
    }
    try {
      var product = await Product.findById(id);
      if (!product) {
        throw "Product not found!";
      }
      
      product.colors.push(body);
     
      product.quantity += body.quantity_color

      await product.save();
      res.redirect(`/home/product/${product._id}`);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  }

  deleteProduct(req, res) {
    const id = req.params.id;
    Product.findByIdAndDelete(id)
      .then((product) => {
        if (!product) {
          throw "Product not found!";
        }
        console.log("Delete product successful");
        for (let i = 0; i < product.colors.length; i++) {
          deleteImage(product.colors[i].image);
        }
        res.redirect("/home/product");
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  }

  async updateProduct(req, res) {
    const body = req.body;
    body.default_price = +body.default_price;
    const id = req.params.id;

    try {
      const product = await Product.findById(id);
      if (!product) {
        throw "";
      }
      body.max_price =
        body.default_price + product.max_price - product.default_price;
      const update = await Product.findOneAndUpdate(
        { _id: id },
        { $set: body }
      );
      if (!update) {
        throw "";
      }
      res.redirect(`/home/product/${id}`);
    } catch (error) {
      console.log(err);
      res.json(err);
    }
  }

  async deleteOption(req, res) {
    const id_product = req.params.id_product;
    const id_color = req.params.id_color;
    try {
      const product = await Product.findOne({ _id: id_product });
      if (!product) {
        throw "Không tìm thấy sản phẩm";
      }

      for (let i = 0; i < product.colors.length; i++) {
        if (product.colors[i]._id == id_color) {
          console.log(product.colors[i]);
          deleteImage(product.colors[i].image);

          product.quantity = product.quantity -  product.colors[i].quantity_color;

          product.colors = product.colors.filter(function (item) {
            return item._id != id_color;
          });
        }
      }

      await product.save();
      res.redirect(`/home/product/${id_product}`);
    } catch (error) {
      console.log(error);
      res.json({ code: 500, message: "Đã xảy ra lỗi" });
    }
  }

  async putDescription(req, res) {
    const data = req.body;
    const id_product = req.params.id;
    if (req.file != null && req.file != undefined) {
      const filename = req.file.filename;
      const filepath = req.file.path;
      const url = await uploadImage(filepath, filename);
      data.image = url;
    }
    if (Object.keys(data).length > 0) {
      try {
        const product = await Product.findById(id_product);
        if (!product) {
          throw "product not found";
        }
        product.description.push(data);
        await product.save();
      } catch (error) {
        console.log(error);
        res.json(error);
      }
    }
    res.redirect(`/home/product/${id_product}`);
  }

  async deleteDescription(req, res) {
    const id_product = req.params.id_product;
    const id_description = req.params.id_description;

    try {
      const product = await Product.findOne({ _id: id_product });
      if (!product) {
        throw "Không tìm thấy sản phẩm";
      }

      for (let i = 0; i < product.description.length; i++) {
        if (product.description[i]._id == id_description) {
          product.description.slice(i, 1);
          break;
        }
      }
      await product.save();
      // res.json(product.description)
      res.redirect(`/home/product/${id_product}`);
    } catch (error) {
      console.log(error);
      res.json({ code: 500, message: "Đã xảy ra lỗi" });
    }
  }
}

module.exports = new Controller();
