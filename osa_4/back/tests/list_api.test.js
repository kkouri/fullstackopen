const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const logger = require('../utils/logger')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

describe('Fetching blogs from database', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
    const promiseArray = blogObjects.map((blog) => blog.save())
    await Promise.all(promiseArray)
    jest.setTimeout(10000)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test("Object contain key 'id' instead of '_id'", async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    expect(blog.id).toBeDefined()
  })
})

describe('Adding new blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
    const promiseArray = blogObjects.map((blog) => blog.save())
    await Promise.all(promiseArray)
    jest.setTimeout(10000)
  })

  test('valid blogs can be added', async () => {
    const newBlog = {
      title: 'new blog!',
      author: 'bar',
      url: 'baz',
      likes: 0,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map((r) => r.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain('new blog!')
  })

  test('non valid blogs are not added', async () => {
    const newBlog = {
      title: 'new blog!',
      author: 'bar',
    }
    await api.post('/api/blogs').send(newBlog).expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('empty like field is casted to value 0', async () => {
    const newBlog = {
      title: 'new blog!',
      author: 'bar',
      url: 'baz',
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blog = response.body.slice(-1)[0]
    expect(blog.likes).toBe(0)
  })

  test('blogs with missing title field are not added', async () => {
    const newBlog = {
      author: 'bar',
      url: 'baz',
      likes: 0,
    }
    await api.post('/api/blogs').send(newBlog).expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs with missing author field are not added', async () => {
    const newBlog = {
      title: 'foo',
      url: 'baz',
      likes: 0,
    }
    await api.post('/api/blogs').send(newBlog).expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('Deleting blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
    const promiseArray = blogObjects.map((blog) => blog.save())
    await Promise.all(promiseArray)
    jest.setTimeout(10000)
  })

  test('deleting a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    console.log(blogToDelete)

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const contents = blogsAtEnd.map((r) => r.id)
    expect(contents).not.toContain(blogToDelete.id)
  })

  test('deleting a non existing blog', async () => {
    const nonExistingId = '5ebadc45a99bde77b2efb20e'
    await api.delete(`/api/blogs/${nonExistingId}`).expect(204)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
