/*
 * @Author: crli
 * @Date: 2020-01-15 11:00:51
 * @LastEditors: crli
 * @LastEditTime: 2020-06-23 15:12:01
 * @Description: file content
 */
const { mongoose } = require('../mongodb/db.js')
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    default: ''
  },
  name: { 
    type: String,   
    default: '佚名'
  },
  password: {
    type: String,
    required: true,
    default: ''
  },
  phone: { type: String, default: '' },
  type: { type: Number, default: 1 } // 0博主，1其他
},
{
  timestamps: {
    createdAt: 'created', 
    updatedAt: 'updated'
  }
})
userSchema.index({id: 1})
module.exports = mongoose.model('User', userSchema)