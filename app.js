/*
 * @Author: crli
 * @Date: 2020-01-14 16:55:45
 * @LastEditors: crli
 * @LastEditTime: 2020-04-17 09:49:07
 * @Description: file content
 */
import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import configlite from 'config-lite'
import router from './routes/index.js'
import mongodb from './mongodb/db.js'
import { checkToken } from './utils'
const config = configlite(__dirname)
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const MongoStore = connectMongo(session)
app.use(cookieParser());
app.use(session({
  name: config.session.name, // 在浏览器中生成cookie的名称key，默认是connect.sid
	secret: config.session.secret, // 通过设置的secret字符串，来计算hash值并放在cookie中，使产生的signedCookie防篡改
	resave: true, // 指每次请求都重新设置session cookie
	saveUninitialized: false,
	cookie: config.session.cookie,
	store: new MongoStore({
  	url: config.url
	})
}))

// router
router(app)

// data server
mongodb.connect()
app.use(function(req, res, next) {
  checkToken(req, res, next)
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // console.log(res)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // console.log(res)
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
