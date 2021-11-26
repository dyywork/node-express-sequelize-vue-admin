'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const filesList = [];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
sequelize.authenticate().then(() => {
  console.log('数据库连接成功');
}).catch(err => {
  console.error(`数据库连接${err}`);
});
/*
原始处理model文件方法
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });
*/
const readFileList = (dir, filesList = []) => {
  const files = fs.readdirSync(dir);
  files.forEach((item, index) => {
    let fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readFileList(path.join(dir, item), filesList);  //递归读取文件
    } else {
      const obj = {};
      if (dir === __dirname && item !== basename) {
        obj.pathName = dir;
        obj.fileName = item;
        filesList.push(obj);
      } else if (dir !== __dirname){
        obj.pathName = dir;
        obj.fileName = item;
        filesList.push(obj);
      }
    }
  });
  return filesList;
}

readFileList(__dirname, filesList)
  filesList.forEach(file => {
    const model = require(path.join(file.pathName, file.fileName))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});



// sequelize.sync({alter: true})
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
