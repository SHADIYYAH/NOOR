const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ status: 'failed', message: 'Access Denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ status: 'failed', message: 'Invalid Token' });
  }
};

module.exports = { authentication };


