import { useState } from 'react'

const Statistics = (props) => {

  let good = props.feedback[0]
  let neutral = props.feedback[1]
  let bad = props.feedback[2]

  let feedback = good + neutral + bad
  if (feedback === 0) {
    return <p>No feedback given</p>
  }
  
  let average = (good - bad) / feedback
  let positive = (good / feedback) * 100

  return (
    <table>
      <tbody>
      <tr>
        <td>good</td>
        <td>{good}</td>
      </tr>
      <tr>
        <td>neutral</td>
        <td>{neutral}</td>
      </tr>
      <tr>
        <td>bad</td>
        <td>{bad}</td>
      </tr>
      <tr>
        <td>all</td>
        <td>{feedback}</td>
      </tr>
      <tr>
        <td>average</td>
        <td>{average}</td>
      </tr>
      <tr>
        <td>positive</td>
        <td>{positive}%</td>
      </tr>
    </tbody>
    </table>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={() => {setGood(good + 1)}}>
        good
      </button>
      <button onClick={() => {setNeutral(neutral + 1)}}>
        neutral
      </button>
      <button onClick={() => {setBad(bad + 1)}}>
        bad
      </button>
      <h1>statistics</h1>
      <Statistics feedback={[good,neutral,bad]}/>
    </div>
  )
}

export default App