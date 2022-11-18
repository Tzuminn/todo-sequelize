// 引入框架及套件
const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

// 引入Model(先拿出db)
const db = require('../../models')
const User = db.User

// 登入頁
router.get('/login', (req, res) => {
  res.render('login')
})

// 登入功能
// 使用Local這個驗證策略，成功就回首頁，失敗就留在login頁
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// 註冊頁
router.get('/register', (req, res) => {
  res.render('register')
})

// 註冊功能
router.post('/register', (req, res) => {
  // 取得表單參數
  const { name, email, password, confirmPassword } = req.body
  // 因為會同時有多則訊息，先建立陣列
  const errors = []

  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符!' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  // 驗證是否有重複註冊
  User.findOne({ email }).then(user => {
    // 已註冊過
    if (user) {
      errors.push({ message: '這個 Email 已經註冊過了。' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)                               //產生「鹽」，複雜度係數為 10
      .then(salt => bcrypt.hash(password, salt)) // 密碼加鹽，產生雜湊值
      .then(hash => User.create({
        name,
        email,
        password: hash                           // 用雜湊值取代原本的使用者密碼
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

// 登出功能
router.get('/logout', (req, res) => {
  req.logout()                  // Passport提供的函式，會清除session
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router 