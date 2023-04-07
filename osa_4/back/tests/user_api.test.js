const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const logger = require('../utils/logger')
const app = require('../app')
const api = supertest(app)

const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'foo',
      name: 'bar',
      password: 'secret',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

describe('Validating inputs', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('too short username', async () => {
    const newUser = {
      username: 'a',
      name: 'bar',
      password: 'secret',
    }

    await api.post('/api/users').send(newUser).expect(400)
  })

  test('too short password', async () => {
    const newUser = {
      username: 'baz',
      name: 'bar',
      password: 's',
    }

    await api.post('/api/users').send(newUser).expect(400)
  })

  test('usernames must be unique', async () => {
    const newUser1 = {
      username: 'unique',
      name: 'bar',
      password: 'secret1',
    }

    const newUser2 = {
      username: 'unique',
      name: 'baz',
      password: 'secret2',
    }

    await api.post('/api/users').send(newUser1).expect(201)
    await api.post('/api/users').send(newUser2).expect(500)
  })
})
