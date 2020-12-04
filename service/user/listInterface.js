const fs = require('fs');
const xlsx = require('node-xlsx');
const {sequelize, List} = require('../../models');
module.exports = {
    getList: async (req, res, next) => {
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
    },
    exportTemplate: async (req, res, next) => {
        try {
            res.download('./uploads/listTemplate.xlsx');
        }
        catch (e) {
            next();
        }
    },
    importList: async (req, res, next) => {
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
    },
};
