const Header = ({ text }) => <h3>{text}</h3>

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

const Courses = ({courses}) => 
  <>
    {courses.map(course => <div key={course.id}>
    <Header text={course.name}/>
    <Content parts={course.parts}/>
    <Total parts={course.parts}/>
    </div>)}
  </>

const App = () => {
  const courses = [
    {
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
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      <h1>Web development curriculum</h1>
      <Courses courses={courses}/>
    </div>
  )
}

export default App