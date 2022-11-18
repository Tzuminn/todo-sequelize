// 匯出一個物件
module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {   //Passport提供的函式，回傳request的登入狀態
      return next()                //回傳true => 進入下一個middleware
    }
    req.flash('warning_msg', '請先登入才能使用！')
    res.redirect('/users/login')   //回傳false => 強制返回login頁面
  }
}