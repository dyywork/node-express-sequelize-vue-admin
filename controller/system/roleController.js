const express = require('express');
const router = express.Router();
const {
  create,
  detail,
  configDuty,
} = require('../../service/user/roleService');

router.post('/createRole', create);
router.get('/configDuty', configDuty);
router.get('/detail', detail);

module.exports = router;
