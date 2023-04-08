const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const logger = require('../utils/logger')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

const initialize = () =>
  beforeEach(async () => {
    await Blog.deleteMany({})

    // temp
    const usersAtStart = await helper.usersInDb()
    const userId = usersAtStart[0].id

    const blogObjects = helper.initialBlogs.map((blog) => {
      const blogWithUserId = { ...blog, userId: userId }
      return new Blog(blogWithUserId)
    })
    const promiseArray = blogObjects.map((blog) => blog.save())
    await Promise.all(promiseArray)
  })

describe('Fetching blogs from database', () => {
  initialize()

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
  initialize()

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
  initialize()

  test('deleting a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

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

describe('Updating blogs', () => {
  initialize()

  test('updating a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const likeValue = 100

    const updatedValues = { ...blogToUpdate, likes: likeValue }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedValues)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find((blog) => (blog.id = blogToUpdate.id))

    expect(updatedBlog.likes).toBe(likeValue)
  })

  test('updating a non existing blog', async () => {
    const nonExistingId = '5ebadc45a99bde77b2efb20e'
    const updatedValues = {
      title: 'foofoo',
      author: 'barbar',
      url: 'bazbaz',
      likes: 0,
    }

    await api.put(`/api/blogs/${nonExistingId}`).send(updatedValues).expect(200)
  })
})
afterAll(async () => {
  await mongoose.connection.close()
})
