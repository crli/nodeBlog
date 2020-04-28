/*
 * @Author: crli
 * @Date: 2020-04-20 11:25:58
 * @LastEditors: crli
 * @LastEditTime: 2020-04-28 13:36:29
 * @Description: file content
 */
const { mongoose } = require('../mongodb/db.js')
const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, validate: /\S+/ },
  desc: { type: String }
},
{
  timestamps: {
    createdAt: 'created', 
    updatedAt: 'updated'
  }
})
tagSchema.index({id: 1})
module.exports = mongoose.model('Tag', tagSchema)