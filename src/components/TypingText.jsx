import PropTypes from 'prop-types'

export function TypingText({ text, charIndex, correctWrong, charRefs }) {
	return (
		<div className='select-none'>
			{text.split('').map((char, index) => (
				<span
					key={index}
					ref={el => (charRefs.current[index] = el)}
					className={`text-xl select-none cursor-text ${
						index === charIndex ? 'border-b-2 border-yellow-300' : ''
					} ${
						correctWrong[index] === 'correct'
							? 'text-green-500'
							: correctWrong[index] === 'wrong'
							? 'text-red-500'
							: ''
					}`}
				>
					{char}
				</span>
			))}
		</div>
	)
}

TypingText.propTypes = {
	text: PropTypes.string.isRequired,
	charIndex: PropTypes.number.isRequired,
	correctWrong: PropTypes.array.isRequired,
	charRefs: PropTypes.object.isRequired,
}
