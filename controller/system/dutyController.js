const express = require('express');
const router = express.Router();
const verifyToken = require('../../utils/verificationToken')
const {
  createDuty
} = require('../../service/user/dutyService');

router.post('/createDuty', verifyToken, createDuty);

module.exports = router;
