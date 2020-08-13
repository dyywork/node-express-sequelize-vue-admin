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
