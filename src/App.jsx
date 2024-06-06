import { useEffect, useReducer, useRef, useState } from 'react'
import { TypingInput } from './components/TypingInput.jsx'
import { TypingStats } from './components/TypingStats.jsx'
import { TypingText } from './components/TypingText.jsx'

const text =
	'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illo in accusamus nobis! Explicabo architecto quibusdam perferendis doloremque reiciendis. Vitae nesciunt sequi nam fugiat laboriosam itaque cupiditate, excepturi animi iure ex.'

const initialState = {
	timeLeft: 30,
	mistakes: 0,
	WPM: 0,
	CPM: 0,
	charIndex: 0,
	isTyping: false,
}

function typingReducer(state, action) {
	switch (action.type) {
		case 'START_TYPING':
			return { ...state, isTyping: true }
		case 'STOP_TYPING':
			return { ...state, isTyping: false }
		case 'DECREMENT_TIME':
			return { ...state, timeLeft: state.timeLeft - 1 }
		case 'INCREMENT_CHAR_INDEX':
			return { ...state, charIndex: state.charIndex + 1 }
		case 'DECREMENT_CHAR_INDEX':
			return { ...state, charIndex: state.charIndex - 1 }
		case 'INCREMENT_MISTAKES':
			return { ...state, mistakes: state.mistakes + 1 }
		case 'DECREMENT_MISTAKES':
			return { ...state, mistakes: state.mistakes - 1 }
		case 'RESET':
			return initialState
		case 'SET_WPM':
			return { ...state, WPM: action.payload }
		case 'SET_CPM':
			return { ...state, CPM: action.payload }
		default:
			return state
	}
}

export function App() {
	const [typing, dispatch] = useReducer(typingReducer, initialState)
	const [correctWrong, setCorrectWrong] = useState([])

	const inputRef = useRef(null)
	const charRefs = useRef([])

	useEffect(() => {
		inputRef.current.focus()
		setCorrectWrong(Array(charRefs.current.length).fill(''))
	}, [])

	useEffect(() => {
		let interval
		if (typing.isTyping && typing.timeLeft > 0) {
			interval = setInterval(() => {
				dispatch({ type: 'DECREMENT_TIME' })

				const correctChars = typing.charIndex - typing.mistakes
				const totalTime = initialState.timeLeft - typing.timeLeft

				if (totalTime > 0) {
					const cpm = Math.max(0, (correctChars * 60) / totalTime || 0)
					dispatch({ type: 'SET_CPM', payload: parseInt(cpm, 10) })

					const wpm = Math.max(
						0,
						Math.round((correctChars / 5 / totalTime) * 60) || 0
					)
					dispatch({ type: 'SET_WPM', payload: wpm })
				}
			}, 1000)
		} else if (typing.timeLeft === 0) {
			clearInterval(interval)
			dispatch({ type: 'STOP_TYPING' })
		}
		return () => {
			clearInterval(interval)
		}
	}, [typing.isTyping, typing.timeLeft, typing.charIndex, typing.mistakes])

	const reset = () => {
		dispatch({ type: 'RESET' })
		setCorrectWrong(Array(charRefs.current.length).fill(''))
		inputRef.current.focus()
	}

	const handleChange = e => {
		const typedValue = e.target.value
		const typedChar = typedValue.slice(-1)
		const isBackspace = typedValue.length < typing.charIndex

		if (isBackspace) {
			dispatch({ type: 'DECREMENT_CHAR_INDEX' })
			if (correctWrong[typing.charIndex - 1] === 'wrong') {
				dispatch({ type: 'DECREMENT_MISTAKES' })
			}
			setCorrectWrong(prev => {
				const newCorrectWrong = [...prev]
				newCorrectWrong[typing.charIndex - 1] = ''
				return newCorrectWrong
			})
		} else if (typing.charIndex < text.length && typing.timeLeft > 0) {
			if (!typing.isTyping) {
				dispatch({ type: 'START_TYPING' })
			}
			if (typedChar === text[typing.charIndex]) {
				dispatch({ type: 'INCREMENT_CHAR_INDEX' })
				setCorrectWrong(prev => {
					const newCorrectWrong = [...prev]
					newCorrectWrong[typing.charIndex] = 'correct'
					return newCorrectWrong
				})
			} else {
				dispatch({ type: 'INCREMENT_CHAR_INDEX' })
				dispatch({ type: 'INCREMENT_MISTAKES' })
				setCorrectWrong(prev => {
					const newCorrectWrong = [...prev]
					newCorrectWrong[typing.charIndex] = 'wrong'
					return newCorrectWrong
				})
			}
		} else {
			dispatch({ type: 'STOP_TYPING' })
		}
	}

	return (
		<>
			<div className='flex w-screen h-screen justify-center items-center bg-white'>
				<div className='max-w-[650px] m-2 p-6 border shadow-xl'>
					<TypingInput handleChange={handleChange} inputRef={inputRef} />
					<TypingText
						text={text}
						charIndex={typing.charIndex}
						correctWrong={correctWrong}
						charRefs={charRefs}
					/>
					<TypingStats
						timeLeft={typing.timeLeft}
						mistakes={typing.mistakes}
						WPM={typing.WPM}
						CPM={typing.CPM}
						reset={reset}
					/>
					<div className='flex justify-center mt-4 text-gray-400 text-sm'>
						<p>
							Press <span className='text-gray-500'>Tab + Enter</span> to quick
							restart
						</p>
					</div>
				</div>
			</div>
		</>
	)
}
