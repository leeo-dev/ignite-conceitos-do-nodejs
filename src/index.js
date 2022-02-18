const express = require('express');
const cors = require('cors');
const { v4: uuidV4 } = require('uuid');
const http = require('./http')

const app = express();

app.use(cors());
app.use(express.json());

const users = [];



const findUserByUsername = (username) => {
  const user = users.find((user) => user.username === username)
  return user
}

const findTodoById = (todos, id) => {
  const todo = todos.find((todo) => todo.id === id)
  return todo
}

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers
  if(!username) return http.badRequest(response, 'username must be provided')

  const user = findUserByUsername(username)
  if(!user) return http.badRequest(response, 'user not found!')

  request.user = user
  next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body

  if(!name) return http.badRequest(response, 'name must be provided')
  if(!username) return http.badRequest(response, 'username must be provided')

  const user = findUserByUsername(username)
  
  if(user) return http.badRequest(response, 'user already exists!')

  const newUser = {
    id: uuidV4(),
    name,
    username,
    todos: []
  }
  users.push(newUser)
  return http.ok(response, { user: newUser })
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request
  return http.ok(response, { todos: user.todos })
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { title, deadline} = request.body

  if(!title) return http.badRequest(response, 'title must provided')
  if(!deadline) return http.badRequest(response, 'deadline must provided')

  const newTodo = {
    id: uuidV4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  user.todos.push(newTodo)
  return http.ok(response, { newTodo })
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
    const { user } = request
    const { id } = request.params
    const { title, deadline } = request.body

    if(!id) return http.badRequest(response, 'id must be provided!')

    const todo = findTodoById(user.todos, id)
    if(!todo) return http.notFound(response, 'todo not found!')

    todo.title = title
    todo.deadline = new Date(deadline)

    return http.ok(response, { todo })
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
    const { user } = request
    const { id } = request.params

    if(!id) return http.badRequest(response, 'id must be provided!')

    const todo = findTodoById(user.todos, id)
    if(!todo) return http.notFound(response, 'todo not found!')
    
    todo.done = true
    return http.ok(response, { todo })
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
      const { user } = request
    const { id } = request.params

    if(!id) return http.badRequest(response, 'id must be provided!')

    const todoIndex = user.todos.findIndex(todo => todo.id === id)
    if(todoIndex < 0) return http.notFound(response, 'todo not found!')

    user.todos.splice(todoIndex, 1)
    return http.noContent(response)
});

module.exports = app;