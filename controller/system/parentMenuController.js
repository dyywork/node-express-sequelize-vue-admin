const express = require('express');
const router = express.Router();
const {
  createParentMenu,
  getList,
  deleteMenu,
  getCodeList,
} = require('../../service/user/parentMenuInterface');

// 创建
router.post('/createParentMenu', createParentMenu);

router.get('/list', getList);

router.delete('/delete/:id', deleteMenu)
router.get('/getCodeList', getCodeList)

module.exports = router;
