/*
 * @Author: crli
 * @Date: 2020-01-16 10:06:53
 * @LastEditors: crli
 * @LastEditTime: 2020-04-15 10:57:12
 * @Description: file content
 */
import mongoose from 'mongoose'
import configlite from 'config-lite'
import chalk from 'chalk'
const config = configlite(__dirname)
mongoose.Promise = global.Promise

const db = mongoose.connection

exports.mongoose = mongoose

exports.connect = () => {
  // 连接数据库
  mongoose.connect(config.url, {
    useNewUrlParser: true,
    autoReconnect: true,
    useFindAndModify: false,
    promiseLibrary: global.Promise
  })

  db.once('open' ,() => {
    console.log(
      chalk.green('连接数据库成功')
    )
  })
  
  db.on('error', function(error) {
      console.error(
        chalk.red('数据库连接失败a: ' + error)
      )
      mongoose.disconnect()
  })
  
  db.on('close', function() {
      console.log(
        chalk.red('数据库断开，重新连接数据库')
      )
  })
  return mongoose
}