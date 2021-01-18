const express = require('express');
const router = express.Router();
const {
  createDuty,
  detail,
  getList,
} = require('../../service/user/dutyService');
/* api/system */
router.get('/dutyList', getList);
router.post('/createDuty', createDuty);
router.get('/detail', detail);

module.exports = router;
