/*
 * @Author: crli
 * @Date: 2020-01-15 09:58:48
 * @LastEditors: crli
 * @LastEditTime: 2020-06-23 14:07:33
 * @Description: file content
 */
import crypto from 'crypto';
const jwt = require('jsonwebtoken');

const obj = {
  MD5_SUFFIX: 'nimei123!',
	md5: function(pwd) {
		let md5 = crypto.createHash('md5');
		return md5.update(pwd).digest('hex');
	},
	// 响应客户端
	responseClient(res, httpCode = 500, code = '0005', msg = '服务端异常', data = null) {
		console.log(4)
		let responseData = {};
		responseData.code = code;
		responseData.msg = msg;
		responseData.data = data;
		res.status(httpCode).json(responseData);
	},
	// 时间格式化
	timestampToTime(timestamp) {
		const date = new Date(timestamp);
		const Y = date.getFullYear() + '-';
		const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		const D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
		const h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
		const m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
		const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
		return Y + M + D + h + m + s;
	},
	createToken(userinfo) {
    const token = jwt.sign(userinfo, '695922129@qq.com', {
    	expiresIn: '7d'  //过期时间设置为7d
    });
    return token;
	},
	checkToken(req, res, next) {
		if (req.url.indexOf('/auth/login') > -1 && req.url.indexOf('/auth/register') > -1) {
			let token = req.headers['authorization']
			// 解析 token
			if (token) {
				// 确认token是否正确
				let decoded = jwt.decode(token, '695922129@qq.com');
				if(token && decoded.exp <= new Date()/1000){
					// return res.json({ success: false, message: 'token过期' });
					obj.responseClient(res, 200, '0001', 'token过期')
				} else{
					return next()
				}
			} else {
				// 如果没有token，则返回错误
				obj.responseClient(res, 403, '0001', '没有提供token！')
			}
		} else {
			next()
		}  
	},
	authorization(req, res){
		const authorization = req.headers.authorization;
		// const token = authorization.split(' ')[1];
		let userInfo
		jwt.verify(authorization, '695922129@qq.com', (err, decoded) => {
			if (err) {
				console.log(err.message)
				return
			}
			userInfo = decoded
		})
		console.log(userInfo)
		if (!userInfo.email && !userInfo.password && !userInfo.id) {
			responseClient(res, 401, '0004', '验证失败请重新登陆')
			return
		}
		return userInfo
	}
}
module.exports = obj