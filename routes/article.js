/*
 * @Author: crli
 * @Date: 2020-04-20 15:48:49
 * @LastEditors: crli
 * @LastEditTime: 2020-05-15 15:16:15
 * @Description: file content
 */
import Article from '../models/article'
import User from '../models/user'
import { responseClient, authorization } from '../utils'
import { timestampToTime } from '../utils'
function getuserName (id, arr) {
  let name = ''
  arr.forEach((ele) => {
    if (ele._id === id) {
      name = ele.name
    }
  })
  if (name) {
    return name
  }
  return '佚名'
}
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
  ).then(result => {
    if (result.n === 1) {
      responseClient(res, 200, '0000', '操作成功!')
    } else {
      responseClient(res, 200, '0001', '文章不存在')
    }
  })
  .catch(err => {
    console.error(err)
    responseClient(result)
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
  Article.deleteMany({ _id: articleId }).then(result => {
    console.log(result)
    if (result.n === 1) {
      responseClient(res, 200, '0000', '操作成功!')
    } else {
      responseClient(res, 200, '0001', '文章不存在')
    }
  })
  .catch(err => {
    console.error(err)
    responseClient(res)
  })
}
exports.getArticleList = (req, res) => {
  let { userid, tagid, categoryid, state, origin, likes, pageNum = 1, pageSize = 10, year , month } = req.body
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
  // 根据用户查找
  if (userid) {
    countconditions = Object.assign(countconditions, {userid: userid})
  }
  if (year && month) {
    countconditions = Object.assign(countconditions, {created: {
      "$gte": new Date(year + '-' + (month < 10 ? '0' + month : month) + '-' + '01'),
      "$lte": new Date(year + '-' + (month < 10 ? '0' + (Number(month) + 1) : (Number(month) + 1)) + '-' + '01')
    }})
  }
  let responseData = {
    count: 0,
    list: [],
  }
  console.log(countconditions)
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
          User.find((error, result1) => {
            if (err) {
              console.error('Error:' + error)
              // throw error
            } else {
              let nArr = JSON.parse(JSON.stringify(result))
              nArr.forEach(element => {
                element.created = timestampToTime(element.created)
                element.name = getuserName(element.userid, JSON.parse(JSON.stringify(result1)))
              })
              let newList = []
              if (tagid) {
                nArr.forEach(item => {
                  item.tags.forEach(value => {
                    if (value._id === tagid) {
                      newList.push(item);
                    }
                  })
                })
                let len = newList.length;
                responseData.count = len;
                responseData.list = newList;
              } else if (categoryid) {
                nArr.forEach(item => {
                  if (item.category._id === categoryid) {
                    newList.push(item);
                  }
                })
                let len = newList.length;
                responseData.count = len;
                responseData.list = newList;
              } else {
                responseData.list = nArr
              }  
              responseClient(res, 200, '0000', '操作成功！', responseData)
            }
          })
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
exports.getHotArticleList = (req, res) => {
  let { userid, pageNum = 1, pageSize = 5 } = req.body
  // 分页默认更新时间排序
  let options = {
    skip: pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize,
    limit: pageSize,
    sort: { views: -1 },
  }
  Article.find({userid: userid}, {}, options, (error, result) => {
    if (error) {
      console.error('Error:' + error)
      // throw error
    } else {
      responseClient(res, 200, '0000', '操作成功！', result)
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
exports.getArchive = (req, res) => {
  let { userid } = req.body
  Article.find({userid: userid}, (error, result) => {
    if (error) {
      console.error('Error:' + error)
      // throw error
    } else {
      let obj = {}
      result.forEach((time) => {
        const date = new Date(time.created)
        let y = date.getFullYear()
        let m = date.getMonth() + 1
        if (obj[y]) {
          if (obj[y][m]) {
            obj[y][m] += 1
          } else {
            obj[y][m] = 1
          }
        } else {
          obj[y] = {}
          obj[y][m] = 1
        }
      })
      
      // let data = {
      //   2020: {
      //     4: 4, 
      //     5: 3
      //   }
      // }
      let times = []
      Object.keys(obj).forEach((ele) => {
        let nobj = {
          year: ele,
          time: []
        }
        Object.keys(obj[ele]).forEach((mon) => {
          nobj.time.push({
            month: mon,
            count: obj[ele][mon]
          })
        })
        times.push(nobj)
      })
      responseClient(res, 200, '0000', '操作成功！', times)
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