/*
 * @Author: crli
 * @Date: 2020-01-16 10:33:38
 * @LastEditors  : crli
 * @LastEditTime : 2020-01-17 14:19:16
 * @Description: file content
 */
module.exports = {
	port: 8001,
  url: 'mongodb://localhost:27017/nodeblog',
  session: {
		name: 'nodeblog',
		secret: 'nodeblog',
		cookie: {
			httpOnly: true,
	    secure: false,
	    maxAge: 365 * 24 * 60 * 60 * 1000
		}
	}
}