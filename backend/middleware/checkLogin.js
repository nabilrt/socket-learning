const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Auth Failed",
    });
  }
};

module.exports = checkLogin;
