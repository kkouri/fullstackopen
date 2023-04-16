const mongoose = require('mongoose')
const { agent } = require('supertest')
const helper = require('./test_helper')
const logger = require('../utils/logger')
const app = require('../app')
const api = agent(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

//let token = null

const initializeUser = async () => {
  // Create user
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({
    username: 'username',
    name: 'name',
    passwordHash,
  })
  await user.save()

  // Login
  const res = await api.post('/api/login').send({
    username: 'username',
    password: 'password',
  })

  const foo = api.auth(res.body.token, { type: 'Bearer' })
}

initializeUser()

beforeEach(async () => {
  // Create blogs
  await Blog.deleteMany({})
  for (let blog of helper.initialBlogs) {
    await api.post('/api/blogs').send(blog)
  }
})

describe('Fetching blogs from database', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  //test("Object contain key 'id' instead of '_id'", async () => {
  //  const response = await api.get('/api/blogs')
  //  const blog = response.body[0]
  //  expect(blog.id).toBeDefined()
  //})
})

//describe('Adding new blogs', () => {
//  initialize()

//  test('valid blogs can be added', async () => {
//    const newBlog = {
//      title: 'new blog!',
//      author: 'bar',
//      url: 'baz',
//      likes: 0,
//    }
//    await api
//      .post('/api/blogs')
//      .send(newBlog)
//      .expect(201)
//      .expect('Content-Type', /application\/json/)

//    const response = await api.get('/api/blogs')

//    const titles = response.body.map((r) => r.title)

//    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
//    expect(titles).toContain('new blog!')
//  })

//  test('non valid blogs are not added', async () => {
//    const newBlog = {
//      title: 'new blog!',
//      author: 'bar',
//    }
//    await api.post('/api/blogs').send(newBlog).expect(400)

//    const blogsAtEnd = await helper.blogsInDb()
//    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
//  })

//  test('empty like field is casted to value 0', async () => {
//    const newBlog = {
//      title: 'new blog!',
//      author: 'bar',
//      url: 'baz',
//    }
//    await api
//      .post('/api/blogs')
//      .send(newBlog)
//      .expect(201)
//      .expect('Content-Type', /application\/json/)

//    const response = await api.get('/api/blogs')
//    const blog = response.body.slice(-1)[0]
//    expect(blog.likes).toBe(0)
//  })

//  test('blogs with missing title field are not added', async () => {
//    const newBlog = {
//      author: 'bar',
//      url: 'baz',
//      likes: 0,
//    }
//    await api.post('/api/blogs').send(newBlog).expect(400)

//    const blogsAtEnd = await helper.blogsInDb()
//    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
//  })

//  test('blogs with missing author field are not added', async () => {
//    const newBlog = {
//      title: 'foo',
//      url: 'baz',
//      likes: 0,
//    }
//    await api.post('/api/blogs').send(newBlog).expect(400)

//    const blogsAtEnd = await helper.blogsInDb()
//    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
//  })
//})

//describe('Deleting blogs', () => {
//  initialize()

//  test('deleting a blog', async () => {
//    const blogsAtStart = await helper.blogsInDb()
//    const blogToDelete = blogsAtStart[0]

//    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

//    const blogsAtEnd = await helper.blogsInDb()
//    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

//    const contents = blogsAtEnd.map((r) => r.id)
//    expect(contents).not.toContain(blogToDelete.id)
//  })

//  test('deleting a non existing blog', async () => {
//    const nonExistingId = '5ebadc45a99bde77b2efb20e'
//    await api.delete(`/api/blogs/${nonExistingId}`).expect(204)
//  })
//})

//describe('Updating blogs', () => {
//  initialize()

//  test('updating a blog', async () => {
//    const blogsAtStart = await helper.blogsInDb()
//    const blogToUpdate = blogsAtStart[0]

//    const likeValue = 100

//    const updatedValues = { ...blogToUpdate, likes: likeValue }

//    await api
//      .put(`/api/blogs/${blogToUpdate.id}`)
//      .send(updatedValues)
//      .expect(200)

//    const blogsAtEnd = await helper.blogsInDb()
//    const updatedBlog = blogsAtEnd.find((blog) => (blog.id = blogToUpdate.id))

//    expect(updatedBlog.likes).toBe(likeValue)
//  })

//  test('updating a non existing blog', async () => {
//    const nonExistingId = '5ebadc45a99bde77b2efb20e'
//    const updatedValues = {
//      title: 'foofoo',
//      author: 'barbar',
//      url: 'bazbaz',
//      likes: 0,
//    }

//    await api.put(`/api/blogs/${nonExistingId}`).send(updatedValues).expect(200)
//  })
//})
afterAll(async () => {
  await mongoose.connection.close()
})
