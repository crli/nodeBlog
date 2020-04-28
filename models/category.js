/*
 * @Author: crli
 * @Date: 2020-04-20 11:30:09
 * @LastEditors: crli
 * @LastEditTime: 2020-04-28 14:21:34
 * @Description: file content
 */
const { mongoose } = require('../mongodb/db.js')
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, validate: /\S+/ },
  desc: { type: String }
},
{
  timestamps: {
    createdAt: 'created', 
    updatedAt: 'updated'
  }
})
categorySchema.index({id: 1})
module.exports = mongoose.model('Category', categorySchema)