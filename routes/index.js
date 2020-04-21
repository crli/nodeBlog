/*
 * @Author: crli
 * @Date: 2020-01-14 16:55:45
 * @LastEditors: crli
 * @LastEditTime: 2020-04-16 16:23:06
 * @Description: file content
 */
const user = require('./user')

module.exports = app => {
  app.post('/auth/register', user.register)
  app.post('/auth/login', user.login)
  app.get('/user/info', user.info)
}
