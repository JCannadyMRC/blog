const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Blog = require('./models/blogSchema')
const mongoose = require('mongoose')


const mongoUrl = process.env.MONGODB_URI

mongoose.connect(mongoUrl)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })





app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  request.send('<h1>Welcome to the blog backend!</h1>')
})

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

app.put('/api/blogs/:id', (request, response) => {

  const newBlog = {
    title: request.body.title,
    author: request.body.author,
    upvotes: request.body.upvotes,
    url: request.body.url,
    id: request.body.id
  }

  Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true, runValidators: true, context: 'query' })
    .then(result => {
      response.json(result)
    })
})

app.delete('/api/blogs/:id', (request, response) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})