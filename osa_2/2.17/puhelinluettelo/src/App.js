import { useEffect, useState } from 'react'
import noteService from './services/persons'

const initialValues = {
  name: "",
  number: ""
}

const FilterForm = (props) => {
  return(
  <form onSubmit={e => { e.preventDefault() }}>
        <div>filter shown with
          <input
            value={ props.filter }
            onChange={ props.handleFilterChange }
          />
        </div>
  </form>
  )
}

const AddPersonForm = (props) => {
  return(
    <form onSubmit={ props.addPerson }>
        <div>name: 
          <input 
            value={ props.values.name }
            onChange={ props.handleInputChange }
            name="name"
          />
        </div>
        <div>number: 
          <input
            value={ props.values.number }
            onChange={ props.handleInputChange }
            name="number"
          />
        </div>
        <div><button type="submit">add</button></div>
      </form>
  )
}

const DeletePopup = (person) => {
  if (window.confirm(`Delete ${person.name}?`)) {
    noteService
      .remove(person.id)
    return true
  }
  return false
}

const Names = (props) => {

  let filteredPersons = props.persons
  if (props.filter.trim() !== "") {
    filteredPersons = props.persons.filter(person => person.name.toUpperCase().search(props.filter.toUpperCase()) !== -1)
  }

  return (
  <div>
    {filteredPersons.map(person => {
      return <p key={ person.name } >{ person.name } { person.number } 
               <button onClick={ () => { if (DeletePopup(person)) { props.deletePerson(person.id) }}}>delete</button> 
             </p>
    })}
  </div>)
} 

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [values, setValues] = useState(initialValues)
  const [filter, setFilter] = useState('')

  const deletePerson = (userId) => {
    setPersons(persons.filter(person => person.id !== userId))
  }

  useEffect(() => {
    noteService
      .getAll()
      .then(persons => setPersons(persons))
  }, [])

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

  const addPerson = (event) => {
    event.preventDefault()
    var newName = event.target.name.value
    if (persons.find(element => element.name === newName) !== undefined) {
      alert(`${newName} is already added to phonebook`)
      setValues(initialValues)
      return
    }

    noteService
      .create(values)
      .then(person => {
        setPersons(persons.concat(person))
        setValues(initialValues)
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <FilterForm filter={ filter } handleFilterChange={ handleFilterChange } />
      <h2>Add a new</h2>
      <AddPersonForm addPerson={ addPerson } values={ values } handleInputChange={ handleInputChange } />
      <h2>Numbers</h2>
      <Names persons={ persons } filter={ filter } deletePerson={ deletePerson }/>
    </div>
  )
}

export default App