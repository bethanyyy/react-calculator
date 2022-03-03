import React from 'react'
import './KeyPadItem.css'
import { ACTIONS } from './Calculator'


function KeyPadNumberItem(props) {
  return (
    <button onClick={() => props.dispatch({type: ACTIONS.ADD_DIGIT, params: {newInput: props.operand}})}>
        {props.children}
    </button>
  )
}

export default KeyPadNumberItem