/*
 * @Author: crli
 * @Date: 2020-04-20 15:48:49
 * @LastEditors: crli
 * @LastEditTime: 2020-04-20 16:47:35
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
    keyword,
    author,
    desc,
    content,
    type,
    state,
    origin,
    tags,
    category,
    img_url
  } = req.body;
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
    keyword: keyword ? keyword.split(',') : [],
    author,
    desc,
    content,
    numbers: content.length,
    type,
    state,
    origin,
    tags: tags ? tags.split(',') : [],
    category: category ? category.split(',') : [],
    img_url
  })
  article.save().then(data => {
    responseClient(res, 200, '0000', '保存成功')
  })
  .catch(err => {
    console.log(err);
    responseClient(res)
    return
  });
}