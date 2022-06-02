import { useState } from 'react'

const initialValues = {
  name: "",
  number: ""
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [values, setValues] = useState(initialValues)
  const [filter, setFilter] = useState('')

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setValues({
      ...values,
      [name]: value,
    })
  }

  const Names = ({persons}) => {
    const filteredPersons = persons.filter(person => filter.toUpperCase().indexOf(person.name.toUpperCase().charAt(0)) === -1)
    
    return (
    <>
      {filteredPersons.map(person => {
        return <p key={person.name} >{person.name} {person.number}</p>
      })}
    </>)
  } 

  const addPerson = (event) => {
    event.preventDefault()
    var newName = event.target.name.value
    if (persons.find(element => element.name === newName) !== undefined) {
      alert(`${newName} is already added to phonebook`)
      setValues(initialValues)
      return
    }
    setPersons(persons.concat(values))
    setValues(initialValues)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={e => { e.preventDefault(); }}>
        <div>filter shown with
          <input
          value={filter}
          onChange={handleFilterChange}
          ></input>
        </div>
      </form>
      <form onSubmit={addPerson}>
        <div>name: 
          <input 
            value={values.name}
            onChange={handleInputChange}
            name="name"
          />
        </div>
        <div>number: 
          <input
            value={values.number}
            onChange={handleInputChange}
            name="number"
          />
        </div>
        <div><button type="submit">add</button></div>
      </form>
      <h2>Numbers</h2>
      <div>
        <Names persons={persons}/>
      </div>
    </div>
  )
}

export default App