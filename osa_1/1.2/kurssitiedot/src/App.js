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

  const Part = (props) => { return (
    <p>{props.part} {props.exercises}</p>
  )}

  const Content = () => { return (
    <div>
      <Part part={part1} exercises={exercises1}/>
      <Part part={part2} exercises={exercises2}/>
      <Part part={part3} exercises={exercises3}/>
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