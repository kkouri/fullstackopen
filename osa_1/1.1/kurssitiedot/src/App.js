const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  const Header = (props) => { return (
    <div>
      <h1>{props.text}</h1>
    </div>
  )}

  const Content = () => { return (
    <div>
      <p>{part1} {exercises1}</p>
      <p>{part2} {exercises2}</p>
      <p>{part3} {exercises3}</p>
    </div>
  )}

  const Total = (props) => { return (
    <div>
      <p>{props.text} {props.value}</p>
    </div>
  )}
  
  
  return (
    <div>
      <Header text={course} />
      <Content/>
      <Total text="Number of exercises" value={exercises1 + exercises2 + exercises3} /> 
    </div>
  )
}

export default App