const jwt = require('jsonwebtoken');
const config = require('./../config')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      console.log('token', token);
      jwt.verify(token, config.secret, function (err, decoded) {
        console.log('decoded', decoded);
        if (err) {
          return res.status(401).json({ status: 401, error: err || 'Unauthorized access.' });
        }

        // const reqData = req.body
        // if ((reqData.email) && (reqData.email in tokenList)) {
        //   const user = { "email": reqData.email }
        //   const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife });
        //   const tokenData = { "token": token }
        //   tokenList[reqData.email].access_token = token
        //   return res.status(200).json({ status: 200, data: tokenData, });
        // } else {
        //   delete tokenList[reqData.email];
        //   return res.status(401).json({ status: 401, error: "token expired" });
        // }

        req.decoded = decoded;
        next();
      });
    } else {
      return res.status(403).json({ status: 403, error: 'No token provided.' });
    }
  } catch (error) {
    return res.status(401).json({ status: 401, error: 'Unauthorized' });
  }
}