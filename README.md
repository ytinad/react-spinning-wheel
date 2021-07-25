# react-spinning-wheel

This component package is fully configurable. you should pass your own array of optColors, array of options. these are compulsory while winningOption is optional. if it is not provided then it will be completely random. there is a callback function onFinished where you will get the winning option.

Also if you want to match with your theme, you can provide primary, contrast color and also the button text. these all are optional.

Now you can also control it's size and play with the upDuration and downDuration property to control it's speed.

Spinning Wheel will run only once by default but if you want to run it more than once then you need to pass `isOnlyOnce={false}`

| Properties     | default value | Optional |
| -------------- | :-----------: | -------: |
| options        |      NA       |       No |
| optColors      |      NA       |       No |
| winningOption  |      NA       |      Yes |
| primaryColor   |    'black'    |      Yes |
| contrastColor  |    'white'    |      Yes |
| buttonText     |    'spin'     |      Yes |
| isOnlyOnce     |     true      |      Yes |
| upDuration     |      100      |      Yes |
| downDuration   |     1000      |      Yes |
| fontFamily     |'proxima-nova' |      Yes |
| autoSpin    	 |     false     |      Yes |

## Usage

```jsx
import React, { Component } from 'react'

import SpinningWheel from 'react-spinning-wheel'
import 'react-spinning-wheel/dist/index.css'

const App = () => {
  const options = [
    'better luck next time',
    'won 70',
    'won 10',
    'better luck next time',
    'won 2',
    'won uber pass',
    'better luck next time',
    'won a voucher'
  ]
  const optColors = [
    '#EE4040',
    '#F0CF50',
    '#815CD1',
    '#3DA5E0',
    '#34A24F',
    '#F9AA1F',
    '#EC3F3F',
    '#FF9000'
  ]
  const onFinished = (winner) => {
    console.log(winner)
  }
  return (
    <SpinningWheel
      options={options}
      optColors={optColors}
      winningOption='won 10'
      onFinished={(winner) => onFinished(winner)}
      primaryColor='black'
      contrastColor='white'
      buttonText='Spin'
      isOnlyOnce={false}
      size={290}
      upDuration={100}
      downDuration={1000}
      fontFamily='Arial'
			autoSpin={false}
    />
  )
}

