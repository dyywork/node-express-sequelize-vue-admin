const express = require('express');
const router = express.Router();

const {createSubMenu} = require('../../service/user/subMenuInterface')

router.post('/createSubMenu', createSubMenu)

module.exports = router;
