const {Duty} = require('../../models');

module.exports = {
  createDuty: async (req, res, next) => {
    const userInfo = req.userInfo;
    try {
      await Duty.findOrCreate({
        where: {code: req.body.code},
        defaults: {
          ...req.body,
          currentAuthority: req.body.currentAuthority.toString(),
          creatorId: userInfo.id,
          creator: userInfo.name
        },
      }).then(([data, created]) => {
        if (!created) {
          res.json({
            code: 200,
            msg: '职责编码已存在！'
          })
        } else {
          data.currentAuthority = data.currentAuthority.split(',');
          res.json({
            code: 200,
            data,
            msg: '创建成功'
          })
        }
      })
    } catch (e) {
      next(e)
    }
  }
};
