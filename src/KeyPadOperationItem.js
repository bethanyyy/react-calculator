import React from 'react';
import { ACTIONS } from './Calculator';

function KeyPadOperationItem(props) {
  return (
    <button onClick={() => props.dispatch({type: ACTIONS.CHOOSE_OPERATION, params: {newInput: props.operand}})}>
        {props.children}
    </button>
  )
}

export default KeyPadOperationItem