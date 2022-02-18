const express = require('express');
const cors = require('cors');
const { v4: uuidV4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers
  if(!username) return response.status(400).json({error: 'Username must be provided'})
  const user = users.find((user) => user.username === username)
  if(!user) response.status(400).json({error: 'user not found!'})
  request.user = user
  next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body
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
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;