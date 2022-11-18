const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')

// 設定.env 如果是在正式環境中執行，就讀取env檔案
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const routes = require('./routes')
const usePassport = require('./config/passport')

const app = express()
const PORT = process.env.PORT


app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)

app.use(flash())
// 設定本地變數，放在 res.locals 裡的資料，所有的 view 都可以存取。
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()  // 把req.isAuthenticated交給res使用
  res.locals.user = req.user                          // 把使用者資料交接給res
  res.locals.success_msg = req.flash('success_msg')   // 設定成功訊息
  res.locals.warning_msg = req.flash('warning_msg')   // 設定警告訊息
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})

