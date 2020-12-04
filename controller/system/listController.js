const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'importFiles/'});

const {
  getList,
  exportTemplate,
  importList
} = require('../../service/user/listInterface')

router.get('/list', getList);
router.get('/export/template', exportTemplate);
router.post('/import', upload.single('file'),importList)

module.exports = router;
