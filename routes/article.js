/*
 * @Author: crli
 * @Date: 2020-04-20 15:48:49
 * @LastEditors: crli
 * @LastEditTime: 2020-04-27 13:31:10
 * @Description: file content
 */
import Article from '../models/article'
import { responseClient, authorization } from '../utils'

exports.addArticle = (req, res) => {
  const { id } = authorization(req, res)
  //验证用户是否已经在数据库中
  const {
    userid,
    title,
    content,
    type,
    state,
    origin,
    tags,
    category,
    img_url
  } = req.body
  if (id && id !== userid) {
    responseClient(res, 401, '0004', '验证失败请重新登陆')
    return
  }
  if (!userid) {
    responseClient(res, 400, '0004', '创建失败')
    return
  }
  let article = new Article({
    userid,
    title,
    content,
    numbers: content.length,
    type,
    state,
    origin,
    tags: tags ? tags.split(',') : [],
    category,
    img_url
  })
  article.save().then(data => {
    responseClient(res, 200, '0000', '保存成功')
  })
  .catch(err => {
    console.log(err);
    responseClient(res)
    return
  })
}
exports.updateArticle = (req, res) => {
  const { id } = authorization(req, res)
  //验证用户是否已经在数据库中
  const {
    userid,
    title,
    content,
    type,
    state,
    origin,
    tags,
    category,
    img_url,
    articleId
  } = req.body
  if (id && id !== userid) {
    responseClient(res, 401, '0004', '验证失败请重新登陆')
    return
  }
  if (!userid) {
    responseClient(res, 400, '0004', '创建失败')
    return
  }
  Article.update(
    { _id: articleId },
    {
      userid,
      title,
      content,
      numbers: content.length,
      type,
      state,
      origin,
      tags: tags ? tags.split(',') : [],
      category,
      img_url,
    },
  ).then(res => {
      responseClient(res, 200, '0000', '操作成功')
    })
    .catch(err => {
      console.error(err)
      responseClient(res)
    })
}
exports.deleteArticle = (req, res) => {
  const { id } = authorization(req, res)
  //验证用户是否已经在数据库中
  const {
    userid,
    articleId
  } = req.body
  if (id && id !== userid) {
    responseClient(res, 401, '0004', '验证失败请重新登陆')
    return
  }
  if (!userid) {
    responseClient(res, 400, '0004', '创建失败')
    return
  }
  Article.deleteMany({ _id: articleId }).then(res => {
    console.log(res)
    // if (res.n === 1) {
    //   responseClient(res, 200, '0000', '删除成功')
    // } else {
    //   responseClient(res, 200, '0001', '文章不存在')
    // }
  })
  .catch(err => {
    console.error(err)
    responseClient(res)
  })
}
exports.getArticleList = (req, res) => {
  let { state, origin, likes, pageNum = 1, pageSize = 10 } = req.body
  // 分页默认更新时间排序
  let options = {
    skip: pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize,
    limit: pageSize,
    sort: { updated: -1 },
  }
  if (likes) {
    options.sort = { likes: 1 }
  }
  let countconditions = {}
  if (state) {
    countconditions = {state: parseInt(state)}
    if (origin) {
      countconditions = {
        $and: [
          {state: parseInt(state)},
          {origin: parseInt(origin)}
        ],
      }
    }
  } else if (origin) {
    countconditions = {origin: parseInt(origin)}
  }
  let responseData = {
    count: 0,
    list: [],
  }
  Article.count(countconditions, (err, count) => {
    console.log('111111111111111111111111111111111')
    if (err) {
      console.log('Error:' + err)
    } else {
      responseData.count = count
      Article.find(countconditions, {}, options, (error, result) => {
        if (err) {
          console.error('Error:' + error)
          // throw error
        } else {
          responseData.list = result
          responseClient(res, 200, '0000', '操作成功！', responseData)
        }
      })
        .populate([
          { path: 'tags' },
          { path: 'category' },
        ])
        .exec((err, doc) => {
          console.log("doc.category:",doc.category)
          console.log("doc.tags:",doc.tags)
        })
    }
  })
}
exports.getArticleDetail = (req, res) => {
  const { articleId } = req.body
  if (!articleId) {
    responseClient(res, 400, '0004', '获取失败')
    return
  }
  Article.findOne({ _id: articleId }, (Error, data) => {
    if (Error) {
      console.error('Error:' + Error)
    } else {
      data.views += 1
      Article.updateOne({ _id: articleId }, { views: data.views })
      .then(result => {
        responseClient(res, 200, '0000', '操作成功 ！', data)
      })
      .catch(err => {
        console.error('err :', err)
        throw err
      });
    }
  })
  .populate([{ path: 'tags' }, { path: 'category' }])
  .exec((err, doc) => {
    console.log("doc.category:",doc.category)
    console.log("doc.tags:",doc.tags)
  });
}
exports.likeArticle = (req, res) => {
  const { id } = authorization(req, res)
  //验证用户是否已经在数据库中
  const {
    userid,
    articleId
  } = req.body
  if (id && id !== userid) {
    responseClient(res, 401, '0004', '验证失败请重新登陆')
    return
  }
  if (!userid) {
    responseClient(res, 400, '0004', '创建失败')
    return
  }
  Article.findOne({ _id: articleId }, (Error, data) => {
    if (Error) {
      console.error('Error:' + Error)
    } else {
      data.likes += 1
      Article.updateOne({ _id: articleId }, { likes: data.likes })
      .then(result => {
        responseClient(res, 200, '0000', '操作成功 ！', data)
      })
      .catch(err => {
        console.error('err :', err)
        throw err
      });
    }
  })
  .populate([{ path: 'tags' }, { path: 'category' }])
  .exec((err, doc) => {
    console.log("doc.category:",doc.category)
    console.log("doc.tags:",doc.tags)
  });
}