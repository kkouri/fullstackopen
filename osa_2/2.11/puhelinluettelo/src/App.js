import { useEffect, useState } from 'react'
import axios from 'axios'

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
          ></input>
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

const Names = (props) => {

  let filteredPersons = props.persons
  if (props.filter.trim() !== "") {
  filteredPersons = props.persons.filter(person => props.filter.toUpperCase().indexOf(person.name.toUpperCase().charAt(0)) !== -1)
  }

  return (
  <div>
    {filteredPersons.map(person => {
      return <p key={ person.name } >{ person.name } { person.number }</p>
    })}
  </div>)
} 

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [values, setValues] = useState(initialValues)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'notes')

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
    setPersons(persons.concat(values))
    setValues(initialValues)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <FilterForm filter={ filter } handleFilterChange={ handleFilterChange } />
      <AddPersonForm addPerson={ addPerson } values={ values } handleInputChange={ handleInputChange } />
      <h2>Numbers</h2>
      <Names persons={ persons } filter={ filter }/>
    </div>
  )
}

export default App