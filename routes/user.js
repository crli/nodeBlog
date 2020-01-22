/*
 * @Author: crli
 * @Date: 2020-01-14 16:55:45
 * @LastEditors  : crli
 * @LastEditTime : 2020-01-16 20:38:20
 * @Description: file content
 */
import User from '../models/user'
import { responseClient, md5 } from '../utils'

exports.register = (req, res) => {
  let { name, password, phone, email, introduce, type } = req.body
  if (!name) {
    responseClient(res, 400, '0004', '用户名不可为空')
    return
  }
  if (!password) {
    responseClient(res, 400, '0004', '密码不可为空')
    return
  }
  if (!email) {
    responseClient(res, 400, '0004', '用户邮箱不可为空')
    return
  }
  const reg = new RegExp(
    '^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$',
  ) //正则表达式
  if (!reg.test(email)) {
    responseClient(res, 400, '0004', '请输入格式正确的邮箱！')
    return
  }
  //验证用户是否已经在数据库中
  User.findOne({ email: email })
    .then(data => {
      if (data) {
        responseClient(res, 200, '0000', '用户邮箱已存在！')
        return
      }
      //保存到数据库
      let user = new User({
        email,
        name,
        password: md5(password),
        phone,
        type,
        introduce,
      })
      user.save().then(data => {
        responseClient(res, 200, '0000', '注册成功', data)
      })
    })
    .catch(err => {
      responseClient(res)
      return
    })
}
