// 引入框架及套件
const express = require('express')
const router = express.Router()
const passport = require('passport')

// 向Facebook發出請求
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

// Facebook 把資料發回來的地方
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// 匯出路由
module.exports = router