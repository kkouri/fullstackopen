import { useState } from 'react'

const Statistics = (props) => {


  let good = props.feedback[0]
  let neutral = props.feedback[1]
  let bad = props.feedback[2]
  
  let feedback = good + neutral + bad
  let average = (good - bad) / feedback
  let positive = (good / feedback) * 100

  if (feedback === 0) {
    average = 0
    positive = 0
  }

  return (
    <>
      <p>all {feedback}</p>
      <p>average {average}</p>
      <p>positive {positive}%</p>
    </>
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
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <Statistics feedback={[good,neutral,bad]}/>
    </div>
  )
}

export default App