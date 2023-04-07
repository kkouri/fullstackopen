const logger = require('../utils/logger')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

const { body, validationResult } = require('express-validator')

usersRouter.post(
  '/',
  [
    body('username')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long.'),
    body('password')
      .isLength({ min: 3 })
      .withMessage('Password must be at least 3 characters long.'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const msg = errors.array()[0].msg
      const error = new Error(`ValidationError: ${msg}`)
      error.statusCode = 400
      error.errors = errors.array()
      return next(error)
    }

    const { username, name, password } = req.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    await user
      .save()
      .then((savedUser) => {
        res.status(201).json(savedUser)
      })
      .catch((error) => next(error))
  }
)

module.exports = usersRouter
