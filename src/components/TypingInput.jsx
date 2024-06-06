import PropTypes from 'prop-types'

export function TypingInput({ handleChange, inputRef }) {
	return (
		<input
			type='text'
			className='absolute opacity-0 z-[-100]'
			ref={inputRef}
			onChange={handleChange}
		/>
	)
}

TypingInput.propTypes = {
	handleChange: PropTypes.func.isRequired,
	inputRef: PropTypes.object.isRequired,
}
