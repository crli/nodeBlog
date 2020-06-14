/*
 * @Author: crli
 * @Date: 2020-01-14 16:55:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-14 12:18:08
 * @Description: file content
 */
import User from '../models/user'
import { responseClient, md5, MD5_SUFFIX, createToken, authorization } from '../utils'

exports.register = (req, res) => {
  console.log(111)
  console.log('11111111111111111111111111111111')
  let { password, email, type, name, phone } = req.body
  // if (!name) {
  //   responseClient(res, 400, '0004', '用户名不可为空')
  //   return
  // }
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
  User.findOne({ email })
    .then(data => {
      if (data) {
        responseClient(res, 200, '0002', '用户邮箱已存在！')
        return
      }
      //保存到数据库
      let user = new User({
        email,
        password: md5(password + MD5_SUFFIX),
        type,
        name,
        phone
      })
      user.save().then(data => {
        responseClient(res, 200, '0000', '注册成功')
      })
    })
    .catch(err => {
      console.log(err)
      responseClient(res)
      return
    })
}

exports.login = (req, res) => {
  let { email, password } = req.body
  if (!email) {
    responseClient(res, 400, '0004', '用户邮箱不可为空')
    return
  }
  if (!password) {
    responseClient(res, 400, '0004', '密码不可为空')
    return
  }
  //验证用户是否已经在数据库中
  let info = { email, password:md5(password + MD5_SUFFIX) }
  User.findOne(info)
    .then(data => {
      if (data) {
        info.id = data.id
        let _token = createToken(info)
        responseClient(res, 200, '0000', '登录成功', {token:_token})
      } else {
        responseClient(res, 200, '0002', '邮箱或者密码不正确!');
      }
    })
    .catch(err => {
      responseClient(res)
      return
    })
}

exports.info = (req, res) => {
  console.log(authorization(req, res))
  const { password, email } = authorization(req, res)
  //验证用户是否已经在数据库中
  User.findOne({email, password})
    .then(data => {
      if (data) {
        let obj = JSON.parse(JSON.stringify(data))
        console.log(obj)
        obj.name = '呵呵撒网撒网'
        obj.avatar = '/avatar2.jpg'
        obj.creatorId = 'admin'
        obj.roleId = 'admin'
        obj.role = {
          'id': 'admin',
          'name': '管理员',
          'describe': '拥有所有权限',
          'status': 1,
          'creatorId': 'system',
          'createTime': 1497160610259,
          'deleted': 0,
          'permissions': [
            {
            'roleId': 'admin',
            'permissionId': 'dashboard',
            'permissionName': '仪表盘',
            'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
            'actionEntitySet': [{
              'action': 'add',
              'describe': '新增',
              'defaultCheck': false
            }, {
              'action': 'query',
              'describe': '查询',
              'defaultCheck': false
            }, {
              'action': 'get',
              'describe': '详情',
              'defaultCheck': false
            }, {
              'action': 'update',
              'describe': '修改',
              'defaultCheck': false
            }, {
              'action': 'delete',
              'describe': '删除',
              'defaultCheck': false
            }],
            'actionList': null,
            'dataAccess': null
          }, 
          // {
          //   'roleId': 'admin',
          //   'permissionId': 'exception',
          //   'permissionName': '异常页面权限',
          //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
          //   'actionEntitySet': [{
          //     'action': 'add',
          //     'describe': '新增',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'query',
          //     'describe': '查询',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'get',
          //     'describe': '详情',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'update',
          //     'describe': '修改',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'delete',
          //     'describe': '删除',
          //     'defaultCheck': false
          //   }],
          //   'actionList': null,
          //   'dataAccess': null
          // }, 
          // {
          //   'roleId': 'admin',
          //   'permissionId': 'result',
          //   'permissionName': '结果权限',
          //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
          //   'actionEntitySet': [{
          //     'action': 'add',
          //     'describe': '新增',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'query',
          //     'describe': '查询',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'get',
          //     'describe': '详情',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'update',
          //     'describe': '修改',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'delete',
          //     'describe': '删除',
          //     'defaultCheck': false
          //   }],
          //   'actionList': null,
          //   'dataAccess': null
          // }, 
          // {
          //   'roleId': 'admin',
          //   'permissionId': 'profile',
          //   'permissionName': '详细页权限',
          //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
          //   'actionEntitySet': [{
          //     'action': 'add',
          //     'describe': '新增',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'query',
          //     'describe': '查询',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'get',
          //     'describe': '详情',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'update',
          //     'describe': '修改',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'delete',
          //     'describe': '删除',
          //     'defaultCheck': false
          //   }],
          //   'actionList': null,
          //   'dataAccess': null
          // }, 
          // {
          //   'roleId': 'admin',
          //   'permissionId': 'table',
          //   'permissionName': '表格权限',
          //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"}]',
          //   'actionEntitySet': [{
          //     'action': 'add',
          //     'describe': '新增',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'import',
          //     'describe': '导入',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'get',
          //     'describe': '详情',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'update',
          //     'describe': '修改',
          //     'defaultCheck': false
          //   }],
          //   'actionList': null,
          //   'dataAccess': null
          // },
          // {
          //   'roleId': 'admin',
          //   'permissionId': 'form',
          //   'permissionName': '表单权限',
          //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
          //   'actionEntitySet': [{
          //     'action': 'add',
          //     'describe': '新增',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'get',
          //     'describe': '详情',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'query',
          //     'describe': '查询',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'update',
          //     'describe': '修改',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'delete',
          //     'describe': '删除',
          //     'defaultCheck': false
          //   }],
          //   'actionList': null,
          //   'dataAccess': null
          // }, 
          // {
          //   'roleId': 'admin',
          //   'permissionId': 'order',
          //   'permissionName': '订单管理',
          //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
          //   'actionEntitySet': [{
          //     'action': 'add',
          //     'describe': '新增',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'query',
          //     'describe': '查询',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'get',
          //     'describe': '详情',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'update',
          //     'describe': '修改',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'delete',
          //     'describe': '删除',
          //     'defaultCheck': false
          //   }],
          //   'actionList': null,
          //   'dataAccess': null
          // }, 
          // {
          //   'roleId': 'admin',
          //   'permissionId': 'permission',
          //   'permissionName': '权限管理',
          //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
          //   'actionEntitySet': [{
          //     'action': 'add',
          //     'describe': '新增',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'get',
          //     'describe': '详情',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'update',
          //     'describe': '修改',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'delete',
          //     'describe': '删除',
          //     'defaultCheck': false
          //   }],
          //   'actionList': null,
          //   'dataAccess': null
          // }, 
          // {
          //   'roleId': 'admin',
          //   'permissionId': 'role',
          //   'permissionName': '角色管理',
          //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
          //   'actionEntitySet': [{
          //     'action': 'add',
          //     'describe': '新增',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'get',
          //     'describe': '详情',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'update',
          //     'describe': '修改',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'delete',
          //     'describe': '删除',
          //     'defaultCheck': false
          //   }],
          //   'actionList': null,
          //   'dataAccess': null
          // }, 
          // {
          //   'roleId': 'admin',
          //   'permissionId': 'table',
          //   'permissionName': '桌子管理',
          //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
          //   'actionEntitySet': [{
          //     'action': 'add',
          //     'describe': '新增',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'get',
          //     'describe': '详情',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'query',
          //     'describe': '查询',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'update',
          //     'describe': '修改',
          //     'defaultCheck': false
          //   }, {
          //     'action': 'delete',
          //     'describe': '删除',
          //     'defaultCheck': false
          //   }],
          //   'actionList': null,
          //   'dataAccess': null
          // }, 
          {
            'roleId': 'admin',
            'permissionId': 'user',
            'permissionName': '用户管理',
            'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
            'actionEntitySet': [{
              'action': 'add',
              'describe': '新增',
              'defaultCheck': false
            }, {
              'action': 'import',
              'describe': '导入',
              'defaultCheck': false
            }, {
              'action': 'get',
              'describe': '详情',
              'defaultCheck': false
            }, {
              'action': 'update',
              'describe': '修改',
              'defaultCheck': false
            }, {
              'action': 'delete',
              'describe': '删除',
              'defaultCheck': false
            }, {
              'action': 'export',
              'describe': '导出',
              'defaultCheck': false
            }],
            'actionList': null,
            'dataAccess': null
          }
          ]
        }
        if (obj.email !== 'youke@qq.com') { //bushi游客
          obj.role.permissions.push(
            {
              'roleId': 'admin',
              'permissionId': 'blog',
              'permissionName': '平台管理',
              'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
              'actionEntitySet': [{
                'action': 'add',
                'describe': '新增',
                'defaultCheck': false
              }, {
                'action': 'query',
                'describe': '查询',
                'defaultCheck': false
              }, {
                'action': 'get',
                'describe': '详情',
                'defaultCheck': false
              }, {
                'action': 'update',
                'describe': '修改',
                'defaultCheck': false
              }, {
                'action': 'delete',
                'describe': '删除',
                'defaultCheck': false
              }],
              'actionList': null,
              'dataAccess': null
            }
          )
          obj.name = '游客'
        }
        console.log(obj)
        responseClient(res, 200, '0000', '成功', obj)
      } else {
        responseClient(res, 200, '0002', '失败');
      }
    })
    .catch(err => {
      responseClient(res)
      return
    })
}
