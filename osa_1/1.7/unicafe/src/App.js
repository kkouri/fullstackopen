import { useState } from 'react'

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [data, setData] = useState({
    feedback: 0,
    average: 0,
    positive: 0
  })

  const handleClick = (button) => {

    let newGood = good
    let newNeutral = neutral
    let newBad = bad
    
    if (button === "good") {
      newGood += 1
      setGood(newGood)
    } else if (button === "neutral") {
      newNeutral += 1
      setNeutral(newNeutral)
    } else if (button === "bad") {
      newBad += 1
      setBad(newBad)
    }
    
    let newFeedback = data.feedback + 1
    let newAverage = (newGood - newBad) / newFeedback
    let newPositive = (newGood / newFeedback) * 100

    const newData = {
    feedback: newFeedback,
    average: newAverage,
    positive: newPositive
    }

    setData(newData)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={() => handleClick("good")}>
        good
      </button>
      <button onClick={() => {handleClick("neutral")}}>
        neutral
      </button>
      <button onClick={() => {handleClick("bad")}}>
        bad
      </button>
      <h1>statistics</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {data.feedback}</p>
      <p>average {data.average}</p>
      <p>positive {data.positive}%</p>
    </div>
  )
}

export default App