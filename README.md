# sequelize 使用注释

## 1.创建表

```bash
  npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
```

## 2.创建种子文件

- 可以创建数据库里面的数据，删除数据库里面的数据

```bash
  npx sequelize-cli seed:generate --name demo-user
```

- 执行后会获取到 支持up/dowm迁移文件相同的语义

```bash
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
  },

  down: (queryInterface, Sequelize) => {
  }
};
```
## 3.删除新增数据库字段  [queryInterface API](https://sequelize.org/v5/class/lib/query-interface.js~QueryInterface.html)
- 假如有个user表我们先运行
```bash
npx sequelize migration:generate --name=update-user
```
- 在文件migrations中有xxxxxxx-update-user.js文件
```js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   /*
    *  删除Users表中的字段
    *  queryInterface.removeColumn(表名称, 字段名)
    *  添加Users表中的字段
    *  queryInterface.addColumn('表名称, 字段名, 字段类型);
    * */
    await queryInterface.removeColumn('Users', 'lastName');
    await queryInterface.addColumn('Users', 'name', Sequelize.STRING(255));
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'name', Sequelize.STRING(255));
    await queryInterface.addColumn('Users', 'age', Sequelize.INTEGER);
  }
};
```
- 更新命令触发up函数
```bash
npx sequelize db:migrate
// 更新指定文件
npx sequelize db:migrate --to xxxxxxxxx-update-user.js
```
- 更新命令撤回down函数
```bash
npx sequelize db:migrate:undo
```
