import { useEffect, useState } from 'react'
import axios from 'axios'

const FilterForm = (props) => {
  return(
  <form onSubmit={e => { e.preventDefault() }}>
        <div>find countries 
          <input
          value={ props.filter }
          onChange={ props.handleFilterChange }
          ></input>
        </div>
  </form>
  )
}

const CountryView = (props) => {
  let country = props.country
  return (
    <div>
      <h1>{country.name.common}</h1>
      <table>
        <tbody>
          <tr>
            <td>capital </td>
            <td>{country.capital}</td>
          </tr>
          <tr>
            <td>area </td>
            <td>{country.area}</td>
          </tr>
        </tbody>
      </table>
      <p></p>
      <strong>languages</strong>
      <ul>{Object.entries(country.languages).map(([key, value]) => <li key={key}>{value}</li>)}</ul>
      <img src={country.flags.png} alt={country.name.common} />
    </div>
  )
}

const Countries = (props) => {

  if (props.countries === []) {
  }

  let filteredCountries = props.countries
  if (props.filter.trim() !== "") {
    filteredCountries = props.countries.filter(country => country.name.common.toUpperCase().includes(props.filter.toUpperCase()))
    
  }
  
  if (filteredCountries.length > 10) {
    return ( <p>Too many matches, specify another filter</p> )
  }

  if (filteredCountries.length === 1) {
    let country = filteredCountries.at(0)
    return (
      <CountryView country={country}/>
    )
  }
  
  return (
  <table>
    <tbody>
      {filteredCountries.map(country => {
        return (
          <tr key={country.cca3}> 
            <td>{ country.name.common }</td>
            <td><button onClick={() => props.setFilter(country.name.common)}>show</button></td>
          </tr>        
      )})}
    </tbody>
  </table>)
}

function App() {
  const [countries, setCountries] = useState([]) 
  const [filter, setFilter] = useState('')
 
  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <FilterForm filter={ filter } handleFilterChange={ handleFilterChange } />
      <Countries countries={ countries } filter={ filter } setFilter={ setFilter } />
    </div>
  )
}

export default App;