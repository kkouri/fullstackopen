const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (req, res, next) => {
  Blog.find({})
    .then((blogs) => {
      res.json(blogs)
    })
    .catch((error) => next(error))
})

blogsRouter.post('/', (req, res, next) => {
  const blog = new Blog(req.body)

  if (!blog.likes) {
    blog.likes = 0
  }

  blog
    .save()
    .then((savedBlog) => {
      res.status(201).json(savedBlog)
    })
    .catch((error) => next(error))
})

blogsRouter.delete('/:id', (req, res, next) => {
  Blog.findByIdAndRemove(req.params.id)
    .then((_) => {
      res.status(204).end()
    })
    .catch((error) => {
      next(error)
    })
})

blogsRouter.put('/:id', (req, res, next) => {
  const { title, author, url, likes } = req.body

  Blog.findByIdAndUpdate(
    req.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedBlog) => {
      res.json(updatedBlog)
    })
    .catch((error) => next(error))
})

module.exports = blogsRouter
