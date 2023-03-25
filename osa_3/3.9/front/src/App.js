import { useEffect, useState } from 'react'
import noteService from './services/persons'
import './App.css'

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

const SortByName = (a,b) => {
    const nameA = a.name.toUpperCase()
    const nameB = b.name.toUpperCase()
    if (nameA < nameB) {
      return -1
    }
    if (nameA > nameB) {
      return 1
    }
  
    return 0
}

const Names = (props) => {

  let filteredPersons = props.persons
  if (props.filter.trim() !== "") {
    filteredPersons = props.persons.filter(person => person.name.toUpperCase().search(props.filter.toUpperCase()) !== -1)
  }

  return (
  <div>
    {filteredPersons.sort((a,b) => SortByName(a,b)).map(person => {
      return <p key={ person.id } >{ person.name } { person.number } 
               <button onClick={ () => { if (DeletePopup(person)) { props.deletePerson(person.id) }}}>delete</button> 
             </p>
    })}
  </div>)
} 

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [values, setValues] = useState(initialValues)
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState({text: null, style: null})

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

  const showNotification = (text, style) => {
    setNotificationMessage({text: text, style: style})
    setTimeout(() => { setNotificationMessage({text: null, style: null}) }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    let newName = event.target.name.value
    let person = persons.find(element => element.name === newName)

    setValues(initialValues)
    
    if (person !== undefined) {
      let confirmed = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (confirmed) {
        noteService
          .update(person.id, values)
          .then(newPerson => {
            setPersons(persons.filter(person => person.id !== newPerson.id).concat(newPerson))
            const text = `Changed the number of ${person.name}`
            showNotification(text, "notification")
          })
          .catch(error => {
            const text = `Information of ${person.name} has already been removed from the server`
            showNotification(text, "errorNotification")
          })
      }
    } else {
      noteService
      .create(values)
      .then(person => {
        setPersons(persons.concat(person))
        const text = `Added ${person.name}`
        showNotification(text, "notification")
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div className={notificationMessage.style}>{notificationMessage.text}</div>
      <FilterForm filter={ filter } handleFilterChange={ handleFilterChange } />
      <h2>Add a new</h2>
      <AddPersonForm addPerson={ addPerson } values={ values } handleInputChange={ handleInputChange } />
      <h2>Numbers</h2>
      <Names persons={ persons } filter={ filter } deletePerson={ deletePerson }/>
    </div>
  )
}

export default App