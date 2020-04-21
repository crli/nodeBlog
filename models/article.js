/*
 * @Author: crli
 * @Date: 2020-04-20 10:42:39
 * @LastEditors: crli
 * @LastEditTime: 2020-04-20 16:52:47
 * @Description: file content
 */
const { mongoose } = require('../mongodb/db.js')
const articleSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, validate: /\S+/ },
  keyword: [{ type: String, default: '' }],
  author: { type: String, required: true, validate: /\S+/ }, 
	desc: { type: String, default: '' },
	content: { type: String, required: true, validate: /\S+/ },
  numbers: { type: String, default: 0 },
  // 文章类型 => 1: 普通文章，2: 简历
  type: { type: Number, default: 1 },
  // 文章发布状态 => 0 草稿，1 已发布
  state: { type: Number, default: 1 },
  // 文章转载状态 => 0 原创，1 转载
	origin: { type: Number, default: 0 },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: true }],
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  img_url: { type: String, default: 'xxxx' },
},
{
  timestamps: {
    createdAt: 'created', 
    updatedAt: 'updated'
  }
})
articleSchema.index({id: 1})
module.exports = mongoose.model('Article', userSchema)