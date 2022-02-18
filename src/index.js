const express = require('express');
const cors = require('cors');
const { v4: uuidV4 } = require('uuid');

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
  if(!username) return response.status(400).json({error: 'username must be provided'})
  const user = findUserByUsername(username)
  if(!user) response.status(400).json({error: 'user not found!'})
  request.user = user
  next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body

  if(!name) return response.status(400).json({error: 'name must be provided'})
  if(!username) return response.status(400).json({error: 'username must be provided'})

  const user = findUserByUsername(username)
  if(user) return response.status(400).json({ user: 'user already exists!' })

  const newUser = {
    id: uuidV4(),
    name,
    username,
    todos: []
  }
  users.push(newUser)
  return response.status(200).json({ user: newUser })
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request
  response.json({ todos: user.todos })
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { title, deadline} = request.body

  if(!title) return response.status(400).json({ error: 'Title must provided' })
  if(!deadline) return response.status(400).json({ error: 'Deadline must provided' })

  const newTodo = {
    id: uuidV4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  user.todos.push(newTodo)
  return response.status(201).json(newTodo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
    const { user } = request
    const { id } = request.params
    const { title, deadline } = request.body

    if(!id) return response.status(400).json({ error: 'id must be provided!'})

    const todo = findTodoById(user.todos, id)
    if(!todo) return response.status(404).json({ error: 'todo not found!'})
    todo.title = title
    todo.deadline = deadline
    response.json({ todo })
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;