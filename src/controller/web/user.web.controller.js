const User = require("../../model/user");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.json({ code: 404, message: "Tài khoản không chính xác" });
    }
    const hashPassword = user.password;
    const matches = await bcrypt.compare(password, hashPassword);
    if (!matches) {
      return res.json({
        code: 404,
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
    }
    res.render("product/viewProduct", {
      code: 200,
      message: "Đăng nhập thành công",
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
