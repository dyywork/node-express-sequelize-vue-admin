const express = require('express');
const router = express.Router();
const verifyToken = require('../../utils/verificationToken');
const {
  createParentMenu,
  getList,
  deleteMenu
} = require('../../service/user/parentMenuInterface');

// 创建
router.post('/createParentMenu', createParentMenu);

router.get('/list', verifyToken, getList);

router.delete('/delete/:id', deleteMenu)

module.exports = router;
