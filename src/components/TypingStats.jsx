import PropTypes from 'prop-types'

export function TypingStats({ timeLeft, mistakes, WPM, CPM, reset }) {
	return (
		<div className='flex justify-between items-center mt-5 pt-4 p-2 text-gray-400'>
			<p>Time: {timeLeft}</p>
			<p>Mistakes: {mistakes}</p>
			<p>WPM: {WPM}</p>
			<p>CPM: {CPM}</p>
			<button className='bg-white text-gray-400 font-bold p-1 rounded hover:text-gray-500' onClick={reset}>
				Restart
			</button>
		</div>
	)
}

TypingStats.propTypes = {
	timeLeft: PropTypes.number.isRequired,
	mistakes: PropTypes.number.isRequired,
	WPM: PropTypes.number.isRequired,
	CPM: PropTypes.number.isRequired,
	reset: PropTypes.func.isRequired,
}
