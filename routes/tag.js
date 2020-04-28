/*
 * @Author: crli
 * @Date: 2020-04-20 11:30:09
 * @LastEditors: crli
 * @LastEditTime: 2020-04-28 16:15:17
 * @Description: file content
 */
import Tag from '../models/tag'
import { responseClient } from '../utils'
//获取全部标签
exports.getTagList = (req, res) => {
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
  Tag.count({}, (err, count) => {
    console.log('111111111111111111111111111111111')
    if (err) {
      console.log('Error:' + err)
    } else {
      responseData.count = count
      Tag.find({}, {}, options, (error, result) => {
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
exports.addTag = (req, res) => {
  let { name, desc } = req.body
  Tag.findOne({
    name,
  }).then(result => {
    if (!result) {
      let tag = new Tag({
        name,
        desc
      })
      tag
        .save()
        .then(data => {
          responseClient(res, 200, '0000', '添加成功')
        })
        .catch(err => {
          console.error(err)
          responseClient(res)
        })
    } else {
      responseClient(res, 200, '0001', '该标签已存在')
    }
  })
  .catch(err => {
    console.error('err :', err)
    responseClient(res)
  })
},
exports.getOneTag = (req, res) => {
  let { tagId } = req.body
  Tag.findOne(
    { _id: tagId }
  ).then(result => {
      responseClient(res, 200, '0000', '获取成功', result)
    })
    .catch(err => {
      console.error(err)
      responseClient(res)
    })
}
exports.updateTag = (req, res) => {
  let { name, desc, tag } = req.body
  Tag.update(
    { _id: tagId },
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
exports.delTag = (req, res) => {
  let { tagId } = req.body
  Tag.deleteMany({ _id: tagId })
    .then(result => {
      if (result.n === 1) {
        responseClient(res, 200, '0000', '操作成功!')
      } else {
        responseClient(res, 200, '0001', '标签不存在')
      }
      console.log(result)
    })
    .catch(err => {
      console.error('Error:' + error)
      responseClient(res)
    })
}
