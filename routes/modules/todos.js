// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 引用 Todo model (先拿db)
const db = require('../../models')
const Todo = db.Todo

// 新增頁面
router.get('/new', (req, res) => {
  return res.render('new')
})

// 新增功能
router.post('/', (req, res) => {
  const userId = req.user.id
  const name = req.body.name       
  return Todo.create({ name, userId })     
    .then(() => res.redirect('/'))         
    .catch(error => console.log(error))
})

// 詳細頁
router.get('/:id', (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  // 加上where
  return Todo.findOne({ where: {id, userId} })
    .then(todo => res.render('detail', { todo: todo.toJSON() }))  // 轉換成 plain object
    .catch(error => console.log(error))
})

// 編輯頁路由
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const id = req.params.id
  return Todo.findOne({ where: { id, userId } })
    .then(todo => res.render('edit', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  const { name, isDone } = req.body   //利用結構賦值的方式取出
  return Todo.findOne({ where: { id, userId } })
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

//刪除功能路由
router.delete('/:id', (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where: { id, userId } })
    .then(todo => todo.destroy())  // 改成destroy()
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 匯出路由模組
module.exports = router