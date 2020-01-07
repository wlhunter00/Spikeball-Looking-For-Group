const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const token = req.header("authtoken");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, "bkQ8i3FRi2oxnIrq");
    req.user = verified;
    next();
  } catch (err) {
    res.send("Invalid Token");
  }
};
