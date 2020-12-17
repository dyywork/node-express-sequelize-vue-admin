const express = require('express');
const router = express.Router();

const {createSubMenu, associateParent, deleteSub} = require('../../service/user/subMenuInterface')

router.post('/createSubMenu', createSubMenu);
router.get('/associateParent', associateParent);
router.get('/deleteSub', deleteSub);

module.exports = router;
