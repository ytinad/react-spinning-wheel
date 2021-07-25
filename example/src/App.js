import React from 'react'

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
		'won a voucher',
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
		'#FF9000',
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
		<React.Fragment>
			<SpinningWheel
				options={options}
				optColors={optColors}
				winningOption={options[3]}
				onFinished={(winner) => onFinished(winner)}
				primaryColor='black'
				contrastColor='white'
				buttonText='Spin'
				isOnlyOnce={true}
				size={290}
				upDuration={100}
				downDuration={1000}
			/>
		</React.Fragment>
	)
}

export default App
