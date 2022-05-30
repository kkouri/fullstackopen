import { useState } from 'react'

const Names = ({persons}) => 
  <>
    {persons.map(person => {
      return <p key={person.name} >{person.name} {person.number}</p>
    })}
  </>

const initialValues = {
  name: "",
  number: ""
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' }
  ]) 
  const [values, setValues] = useState(initialValues)

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

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
      <form onSubmit={addPerson}>
        <div>name: <input 
                  value={values.name}
                  onChange={handleInputChange}
                  name="name"
                  /></div>
        <div>number: <input
                  value={values.number}
                  onChange={handleInputChange}
                  name="number"
                  /></div>
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