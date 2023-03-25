require('dotenv').config()

const express = require('express')
const bp = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const Contacts = require('./models/mongo')

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

app.get('/api/persons/:id', (req, res) => {
	Contacts.findById(req.params.id)
		.then((person) => {
			res.json(person)
		})
		.catch((error) => {
			res.status(404).json({ error: 'id not found' })
		})
})

app.delete('/api/persons/:id', (req, res) => {
	Contacts.findByIdAndDelete(id)
		.then((deletedPerson) => {
			res.status(204)
		})
		.catch((error) => {
			res.status(500).send(error)
		})
})

app.post('/api/persons', (req, res) => {
	console.log('req.body', req.body)
	if (req.body.name === undefined) {
		return res.status(400).json({ error: 'name missing' })
	}

	if (req.body.number === undefined) {
		return res.status(400).json({ error: 'number missing' })
	}

	// if (Contacts.exists({ name: req.body.name })) {
	// 	return res.status(400).json({
	// 		error: 'name already exists',
	// 	})
	// }

	// if (Contacts.exists({ number: req.body.number })) {
	// 	return res.status(400).json({
	// 		error: 'number already exists',
	// 	})
	// }

	const newContact = new Contacts({
		name: req.body.name,
		number: req.body.number,
	})

	console.log('new contact', newContact)

	newContact.save().then((savedContact) => {
		res.json(savedContact)
	})
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
