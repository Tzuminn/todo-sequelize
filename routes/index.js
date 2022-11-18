// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 載入模組
const home = require('./modules/home')
const todos = require('./modules/todos')
const users = require('./modules/users')
const auth = require('./modules/auth')

// 掛載middleware
const { authenticator } = require('../middleware/auth')

// 將網址結構符合' '字串的 request 導向相對模組
// 加入驗證程序
router.use('/todos', authenticator, todos)
router.use('/users', users)
router.use('/auth', auth)
router.use('/', authenticator, home)

// 匯出路由器
module.exports = router