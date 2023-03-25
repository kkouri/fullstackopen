const mongoose = require('mongoose')
mongoose.set('strictQuery', false);

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length == 4) {
  console.log('give both name and number')
  process.exit(1)
}

if (process.argv.length > 5) {
  console.log('Too many arguments')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.kwucloa.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length == 3) {
  Contact.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(note => {
      console.log(`${note.name} ${note.number}`)
    })
    mongoose.connection.close()
  })
} 

if (process.argv.length == 5) {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
  })

  contact.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}