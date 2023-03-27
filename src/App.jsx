import { useReducer } from 'react';
import Digit from './components/Digit';
import OperationButton from './components/OperationButton'
import './style.scss';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperand === 0) {
        return {
          ...state,
          currentOperand: "0."
        }
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }

    case ACTIONS.CLEAR:
      // return {}
      return { currentOperand: 0, previousOperand: '', operation: '' }

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand === 0 && state.previousOperand === '') {
        return state
      }

      if (state.currentOperand === '') {
        return {
          ...state,
          operation: payload.operation,
        }
      }
      if (state.previousOperand === '') {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: ''
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: ''
      }
    case ACTIONS.EVALUATE:
      if (state.operation === '' || state.currentOperand === '' || state.previousOperand === '') {
        return state
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: '',
        operation: '',
        currentOperand: evaluate(state)
      }
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: 0
        }
      }
      if (state.currentOperand === 0) {
        return state
      }
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: 0 }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
  }
}


function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }
  return computation.toString()
}


const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
})

function formatOperand(operand) {
  if (operand == '') return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

export default function App() {

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, { currentOperand: 0, previousOperand: '', operation: '' })

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => { dispatch({ type: ACTIONS.CLEAR }) }}>AC</button>
      <button className="" onClick={() => { dispatch({ type: ACTIONS.DELETE_DIGIT }) }}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <Digit digit="1" dispatch={dispatch} />
      <Digit digit="2" dispatch={dispatch} />
      <Digit digit="3" dispatch={dispatch} />

      <OperationButton operation="*" dispatch={dispatch} />
      <Digit digit="4" dispatch={dispatch} />
      <Digit digit="5" dispatch={dispatch} />
      <Digit digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <Digit digit="7" dispatch={dispatch} />
      <Digit digit="8" dispatch={dispatch} />
      <Digit digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <Digit digit="." dispatch={dispatch} />
      <Digit digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => { dispatch({ type: ACTIONS.EVALUATE }) }}>=</button>
    </div >
  )
}