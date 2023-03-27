import { ACTIONS } from '../App'

export default function Digit({ dispatch, operation }) {
    return (
        <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: operation } })}>
            {operation}
        </button >
    )
}