const express = require('express');
const router = express.Router();
const {
  create,
  detail,
  configDuty,
  getList,
} = require('../../service/user/roleService');

router.post('/createRole', create);
router.get('/roleList', getList);
router.post('/configDuty', configDuty);
router.get('/detail', detail);

module.exports = router;
