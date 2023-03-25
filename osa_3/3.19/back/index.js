const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Contacts = require('./models/mongo')

const bp = require('body-parser')
const morgan = require('morgan')

const errorHandler = (error, req, res, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message })
	}

	next(error)
}

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.static('build'))
app.use(express.json())
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

morgan.token('type', (req, res) => {
	if (req.method == 'POST') {
		return JSON.stringify(req.body)
	}
})

app.use(morgan(':method :url :response-time :type'))
app.use(cors())

app.get('/api/persons', (req, res) => {
	Contacts.find({}).then((persons) => {
		res.json(persons)
	})
})

app.get('/api/persons/:id', (req, res, next) => {
	Contacts.findById(req.params.id)
		.then((person) => {
			if (person) {
				res.json(person)
			} else {
				res.status(404).end()
			}
		})
		.catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
	Contacts.findByIdAndRemove(req.params.id)
		.then((result) => {
			res.status(204).end()
		})
		.catch((error) => {
			next(error)
		})
})

app.post('/api/persons', (req, res, next) => {
	const newContact = new Contacts({
		name: req.body.name,
		number: req.body.number,
	})

	newContact
		.save()
		.then((savedContact) => {
			res.json(savedContact)
		})
		.catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
	const { name, number } = req.body

	const person = {
		name: body.name,
		number: body.number,
	}

	Contacts.findByIdAndUpdate(
		req.params.id,
		{ name, number },
		{ new: true, runValidators: true, context: 'query' }
	)
		.then((updatedPerson) => {
			res.json(updatedPerson)
		})
		.catch((error) => next(error))
})

app.get('/api/info', (req, res) => {
	var today = new Date()
	Contacts.find({}).then((contacts) => {
		res.send(`<div>
                <div>Phonebook has info for ${contacts.length} people</div>
                <div>${today}</div>
            </div>`)
	})
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
