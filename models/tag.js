/*
 * @Author: crli
 * @Date: 2020-04-20 11:25:58
 * @LastEditors: crli
 * @LastEditTime: 2020-04-20 11:29:45
 * @Description: file content
 */
const { mongoose } = require('../mongodb/db.js')
const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, validate: /\S+/ },
  desc: String,
},
{
  timestamps: {
    createdAt: 'created', 
    updatedAt: 'updated'
  }
})
tagSchema.index({id: 1})
module.exports = mongoose.model('Tag', userSchema)