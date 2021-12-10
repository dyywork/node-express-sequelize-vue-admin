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
  currentUser,
} = require('../../service/user/user')
// 登录
router.post('/login', login);
// 创建用户
router.post('/create',createUser);
// 删除用户
router.delete('/delete/:id', deleteUser);
// 更新用户
router.put('/update', updateUser);
// 查询用户详情
router.get('/detail/:id', getUserDetails);
// 查询用户列表
router.get('/list', userList);
// 配置用户角色
router.post('/configRoles', configRoles);
// 获取用户信息
router.get('/currentUser', currentUser);
// 上传用户头像
router.post('/img',upload.single('file'), uploadHeaderImg);
// 导出用户列表
router.get('/export/list', exportUserList);



module.exports = router;
