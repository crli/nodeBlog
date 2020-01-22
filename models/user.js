/*
 * @Author: crli
 * @Date: 2020-01-15 11:00:51
 * @LastEditors  : crli
 * @LastEditTime : 2020-01-17 14:54:47
 * @Description: file content
 */
import autoIncrement from 'mongoose-auto-increment'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    default: ''
  },
  name: { 
    type: String, 
    required: true,
    default: ''
  },
  password: {
    type: String,
    required: true,
    default: crypto
      .createHash('md5')
      .update(argv.auth_default_password || 'root')
      .digest('hex'),
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
userSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});