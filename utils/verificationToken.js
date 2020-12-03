const jwt = require('jsonwebtoken');
const {User} = require('../models');

module.exports = async (req, res, next) => {
  try{
    await User.findOne({where: {token: req.headers.token}}).then(data => {
      if (!data) {
        res.json({
          code: 503,
          msg: '账号以再其他地方登录，请重新登录',
        })
        next()
      } else {
        if (data.timeout.getTime() < new Date().getTime()) {
          res.json({
            code: 503,
            msg: 'token已过期，请重新登录',
          })
          next()
        }
      }
    })
    const tokenMsg =  await jwt.verify(req.headers.token, 'dingyongya');
    req.userInfo = tokenMsg;
    await User.update({timeout: (new Date().getTime())+ 60*60*1000},{where: {id: tokenMsg.id}})
    next();
  }
  catch (e) {
    next(e)
  }

}
