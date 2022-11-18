// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 引用 model
const db = require('../../models')
const Todo = db.Todo
const User = db.User

// 首頁路由
router.get('/', (req, res) => {
  const UserId = req.user.id
  User.findByPk(UserId)
    .then(user => {
      if (!user) throw new Error('user not found')

      return Todo.findAll({
        raw: true,             // 用raw和nest將多筆資料轉成JS物件
        nest: true,
        where: { UserId }
      })
    })
    .then(todos => res.render('index', { todos }))
    .catch(error => console.error(error))
})

// 匯出路由模組
module.exports = router