const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.decode(token, "secret123");
    const verify = jwt.verify(token, "secret123");
    req.body.user_type = decoded.userType;
    next();
  } catch (err) {
    res.status(401).json({
      status: 401,
      message: "Authorization Failed",
    });
  }
};
