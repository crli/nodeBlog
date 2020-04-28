/*
 * @Author: crli
 * @Date: 2020-04-20 11:30:09
 * @LastEditors: crli
 * @LastEditTime: 2020-04-28 15:48:34
 * @Description: file content
 */
import Category from '../models/category'
import { responseClient } from '../utils'
//获取全部分类
exports.getCategoryList = (req, res) => {
  let { pageNum = 1, pageSize = 10 } = req.body
  // 分页默认更新时间排序
  let options = {
    skip: pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize,
    limit: pageSize,
    sort: { updated: -1 },
  }
  let responseData = {
    count: 0,
    list: [],
  }
  Category.count({}, (err, count) => {
    console.log('111111111111111111111111111111111')
    if (err) {
      console.log('Error:' + err)
    } else {
      responseData.count = count
      Category.find({}, {}, options, (error, result) => {
        if (error) {
          console.error('Error:' + error)
        } else {
          responseData.list = result
          responseClient(res, 200, '0000', '操作成功！', responseData)
        }
      })
    }
  }).catch(err => {
    console.error('err :', err)
    responseClient(res)
  })
}
exports.addCategory = (req, res) => {
  let { name, desc } = req.body
  Category.findOne({
    name,
  }).then(result => {
    if (!result) {
      let category = new Category({
        name,
        desc
      })
      category
        .save()
        .then(data => {
          responseClient(res, 200, '0000', '添加成功')
        })
        .catch(err => {
          console.error(err)
          responseClient(res)
        })
    } else {
      responseClient(res, 200, '0001', '该分类已存在')
    }
  })
  .catch(err => {
    console.error('err :', err)
    responseClient(res)
  })
},
exports.getOneCategory = (req, res) => {
  let { categoryId } = req.body
  Category.findOne(
    { _id: categoryId }
  ).then(result => {
      responseClient(res, 200, '0000', '获取成功', result)
    })
    .catch(err => {
      console.error(err)
      responseClient(res)
    })
}
exports.updateCategory = (req, res) => {
  let { name, desc, categoryId } = req.body
  Category.update(
    { _id: categoryId },
    {
      name,
      desc
    },
  ).then(result => {
      responseClient(res, 200, '0000', '操作成功')
    })
    .catch(err => {
      console.error(err)
      responseClient(res)
    })
}
exports.delCategory = (req, res) => {
  let { categoryId } = req.body
  Category.deleteMany({ _id: categoryId })
    .then(result => {
      if (result.n === 1) {
        responseClient(res, 200, '0000', '操作成功!')
      } else {
        responseClient(res, 200, '0001', '分类不存在')
      }
      console.log(result)
    })
    .catch(err => {
      console.error('Error:' + error)
      responseClient(res)
    })
}
