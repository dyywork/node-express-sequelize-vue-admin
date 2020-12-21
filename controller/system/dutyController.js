const express = require('express');
const router = express.Router();
const {
  createDuty,
  detail,
} = require('../../service/user/dutyService');

router.post('/createDuty', createDuty);
router.get('/detail', detail);

module.exports = router;
