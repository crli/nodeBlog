/*
 * @Author: crli
 * @Date: 2020-01-14 16:55:45
 * @LastEditors: crli
 * @LastEditTime: 2020-07-10 14:57:20
 * @Description: file content
 */
const user = require('./user')
const article = require('./article')
const category = require('./category')
const tag = require('./tag')
module.exports = app => {
  app.post('/v1/auth/register', user.register)
  app.post('/v1/auth/login', user.login)
  app.get('/v1/user/info', user.info)
  app.post('/v1/article/addArticle', article.addArticle)
  app.post('/v1/article/updateArticle', article.updateArticle)
  app.post('/v1/article/deleteArticle', article.deleteArticle)
  app.post('/v1/article/getArticleList', article.getArticleList)
  app.post('/v1/article/getArticleDetail', article.getArticleDetail)
  app.post('/v1/article/likeArticle', article.likeArticle)
  app.post('/v1/article/getHotArticleList', article.getHotArticleList)
  app.post('/v1/article/getArchive', article.getArchive)
  app.post('/v1/category/getCategoryList', category.getCategoryList)
  app.post('/v1/category/addCategory', category.addCategory)
  app.post('/v1/category/getOneCategory', category.getOneCategory)
  app.post('/v1/category/updateCategory', category.updateCategory)
  app.post('/v1/category/delCategory', category.delCategory)
  app.post('/v1/tag/getTagList', tag.getTagList)
  app.post('/v1/tag/addTag', tag.addTag)
  app.post('/v1/tag/getOneTag', tag.getOneTag)
  app.post('/v1/tag/updateTag', tag.updateTag)
  app.post('/v1/tag/delTag', tag.delTag)
}
