const express = require('express')
const bp = require('body-parser')
const morgan = require('morgan')
const app = express()

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(morgan('tiny'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  },
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {

  // Check that no duplicate id is given
  let id = Math.floor(Math.random() * 1000)
  while (persons.find(person => person.id === id)) {
    id = Math.floor(Math.random() * 1000) 
  }

  const body = req.body

  if (!body.name) {
    return res.status(400).json({ 
      error: 'name missing' 
    })
  } else {
    if (persons.find(person => person.name === body.name)) {
      return res.status(400).json({ 
        error: 'name already exists' 
      })
    }
  }

  if (!body.number) {
    return res.status(400).json({ 
      error: 'number missing' 
    })
  } else {
    if (persons.find(person => person.number === body.number)) {
      return res.status(400).json({ 
        error: 'number already exists' 
      })
    }
  }

  const person = {
    ...body,
    id: id
  }

  persons = persons.concat(person)
  
  res.json(person)
})

app.get('/info', (req, res) => {
  var today = new Date();

  res.send(`<div>
    <div>Phonebook has info for ${persons.length} people</div>
    <div>${today}</div>
  </div>`)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})