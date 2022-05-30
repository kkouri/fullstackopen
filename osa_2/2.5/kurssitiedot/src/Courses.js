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

const Courses = ({courses}) => {
    return (
    <>
      {courses.map(course => <div key={course.id}>
      <Header text={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
      </div>)}
    </>)}

  export default Courses