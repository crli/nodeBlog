/*
 * @Author: crli
 * @Date: 2020-01-14 16:55:45
 * @LastEditors  : crli
 * @LastEditTime : 2020-01-15 11:01:23
 * @Description: file content
 */
const user = require('./user')

module.exports = app => {
  app.post('/register', user.register)
}
