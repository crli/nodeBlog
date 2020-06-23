/*
 * @Author: crli
 * @Date: 2020-06-23 16:15:34
 * @LastEditors: crli
 * @LastEditTime: 2020-06-23 16:17:12
 * @Description: file content
 */ 
module.exports = {
  apps: [
    {
      // 生产环境
      name: "prod",
      // 项目启动入口文件
      script: "./bin/www",
      // 项目环境变量
      env: {
        "NODE_ENV": "production"
      }
    }
] }