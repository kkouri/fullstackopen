import { useState } from 'react'

const Names = ({persons}) => 
  <>
    {persons.map(person => <p key={person.name} >{person.name}</p>)}
  </>

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const addName = (event) => {
    event.preventDefault()
    setPersons(persons.concat({name: newName}))
    setNewName('')
  }

  const handleNoteChange = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input 
                  value={newName}
                  onChange={handleNoteChange}
                />
        </div>
        <div>
            <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        <Names persons={persons}/>
      </div>
    </div>
  )
}

export default App