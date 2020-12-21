const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads' });
const {
  uploadHeaderImg,
  userList,
  exportUserList,
  createUser,
  deleteUser,
  updateUser,
  getUserDetails,
  login,
  configRoles,
} = require('../../service/user/user')

router.get('/configRoles', configRoles);
router.get('/list', userList);

router.post('/img',upload.single('file'), uploadHeaderImg);
// 导出用户列表
router.get('/export/list', exportUserList);
// 创建用户
router.post('/create',createUser);

// 删除用户
router.delete('delete/:id', deleteUser);

// 更新用户
router.put('/update', updateUser);

// 查询用户
router.get('detail/:id', getUserDetails);

// 登录
router.post('/login', login);

module.exports = router;
