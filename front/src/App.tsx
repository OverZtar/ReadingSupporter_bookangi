import { useReducer } from 'react'
import { initialState, reduce } from '@/modules/state/machine'
import { Reader } from '@/modules/viewer/Reader'

export function App() {
  const [state, dispatch] = useReducer(reduce, initialState)
  return <Reader state={state} dispatch={dispatch} />
}
