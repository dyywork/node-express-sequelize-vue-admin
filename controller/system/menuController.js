const express = require('express');
const router = express.Router();
const {
  create,
  list,
  deleteService
} = require('../../service/user/menuService');

router.post('/create', create);
router.get('/list', list)
router.get('/delete', deleteService)

module.exports = router;
