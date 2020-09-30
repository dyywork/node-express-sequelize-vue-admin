const express = require('express');
const fs = require('fs');
const multer = require('multer');
const router = express.Router();
const xlsx = require('node-xlsx');

const Sequelize = require('sequelize');

const {Op, Transaction} = Sequelize;

const {sequelize, List} = require('../../models');

const upload = multer({dest: 'importFiles/'});

router.get('/list', async (req, res, next) => {
    try{
        await List.findAll().then(list => {
            res.json({
                list
            })
        })
    }
    catch (e) {
        next()
    }
})


router.get('/export/template', async (req, res, next) => {
    try {
        res.download('./uploads/listTemplate.xlsx');
    }
    catch (e) {
        next();
    }
})

router.post('/import', upload.single('file'),async (req, res, next) => {
    const t = await sequelize.transaction();
    try{
         fs.renameSync(req.file.path, `importFiles/${req.file.originalname}`);
         const sheet = xlsx.parse(`./importFiles/${req.file.originalname}`);
         const arrList = [];
         sheet[0].data.shift()
         sheet[0].data.forEach(item => {
             const obj = {
                 name: item[0],
                 address: item[1],
                 email: item[2],
             }
             arrList.push(obj);
         })

        await List.bulkCreate(arrList, {fields: ['name', 'address', 'email'], transaction: t}).then(list => {
            res.json({
                data: list,
                arrList,
                sheet,
            })
        })
         await t.commit();
    }
    catch (e){
        await t.rollback();
        throw Error(e)
        next();
    }
})


module.exports = router;
