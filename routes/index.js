/*
 * @Author: crli
 * @Date: 2020-01-14 16:55:45
 * @LastEditors: crli
 * @LastEditTime: 2020-04-28 16:18:40
 * @Description: file content
 */
const user = require('./user')
const article = require('./article')
const category = require('./category')
const tag = require('./tag')
module.exports = app => {
  app.post('/auth/register', user.register)
  app.post('/auth/login', user.login)
  app.get('/user/info', user.info)
  app.post('/article/addArticle', article.addArticle)
  app.post('/article/updateArticle', article.updateArticle)
  app.post('/article/deleteArticle', article.deleteArticle)
  app.post('/article/getArticleList', article.getArticleList)
  app.post('/article/getArticleDetail', article.getArticleDetail)
  app.post('/article/likeArticle', article.likeArticle)
  app.post('/category/getCategoryList', category.getCategoryList)
  app.post('/category/addCategory', category.addCategory)
  app.post('/category/getOneCategory', category.getOneCategory)
  app.post('/category/updateCategory', category.updateCategory)
  app.post('/category/delCategory', category.delCategory)
  app.post('/tag/getTagList', tag.getTagList)
  app.post('/tag/addTag', tag.addTag)
  app.post('/tag/getOneTag', tag.getOneTag)
  app.post('/tag/updateTag', tag.updateTag)
  app.post('/tag/delTag', tag.delTag)
}
