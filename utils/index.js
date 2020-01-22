/*
 * @Author: crli
 * @Date: 2020-01-15 09:58:48
 * @LastEditors  : crli
 * @LastEditTime : 2020-01-15 11:01:54
 * @Description: file content
 */
import crypto from 'crypto';

module.exports = {
  MD5_SUFFIX: 'nimei123!',
	md5: function(pwd) {
		let md5 = crypto.createHash('md5');
		return md5.update(pwd + MD5_SUFFIX).digest('hex');
	},
	// 响应客户端
	responseClient(res, httpCode = 500, code = '0005', msg = '服务端异常', data = {}) {
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
};
