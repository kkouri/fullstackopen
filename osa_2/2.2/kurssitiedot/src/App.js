const Header = ({ text }) => <h1>{text}</h1>

const Total = ({ parts }) => {
  const sum = parts.reduce((a, b) => a + b.exercises, 0)
  return <b>total of {sum} exercises</b>
}

const Part = ({ part }) => 
  <>
    {part.name} {part.exercises}
  </>

const Content = ({ parts }) => 
  <>
    {parts.map(part => <p key={part.id}>{<Part part={part}/>}</p>)}
  </>

const Course = ({course}) => 
  <>
    <Header text={course.name}/>
    <Content parts={course.parts}/>
    <Total parts={course.parts}/>
  </>

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return (
    <div>
      <Course course={course}/>
    </div>
  )
}

export default App