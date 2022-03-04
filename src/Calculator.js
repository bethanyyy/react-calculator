import React, { useEffect, useRef, useState } from 'react'
import './Calculator.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHeart ,faDeleteLeft ,faDivide, fa0, fa1, fa2, fa3, fa4, fa5, fa6, fa7, fa8, fa9, faMultiply, faPlus, faMinus, faEquals } from '@fortawesome/free-solid-svg-icons'
import KeyPadNumberItem from './KeyPadItem';
import { useReducer } from 'react';
import KeyPadOperationItem from './KeyPadOperationItem';
import { CSSTransition } from 'react-transition-group'

export const ACTIONS = {
    ADD_DIGIT: 'addDigit',
    CHOOSE_OPERATION: 'chooseOperation',
    CLEAR: 'clear',
    DELETE_DIGIT: 'deleteDigit',
    EQUALS: 'equals'
  }
  
  function reducer(state, action) {
    // update state
    switch(action.type) {
        case ACTIONS.ADD_DIGIT:
            if (state.newCalculation == true) {
                return {
                    ...state,
                    currentOperand: action.params.newInput,
                    newCalculation: false
                }
            }
            if (action.params.newInput === '0' && state.currentOperand === '0') {
                return state;
            }
            if (action.params.newInput === '.' && state.currentOperand && state.currentOperand.includes('.')) {
                return state;
            }
            return {
                ...state,
                currentOperand: `${state.currentOperand || ''}${action.params.newInput}`
            };
    
        case ACTIONS.CHOOSE_OPERATION :
            if (state.previousOperand == null && state.currentOperand == null) {
                return state;
            }

            if (state.previousOperand == null && state.currentOperand != null) {
                return {
                    ...state,
                    previousOperand: state.currentOperand,
                    operation: action.params.newInput,
                    currentOperand: null
                }
            }

            if (state.previousOperand != null && state.currentOperand == null) {
                return {
                    ...state,
                    operation: action.params.newInput
                }
            }

            return {
                ...state,
                previousOperand: evaluate(state),
                operation: action.params.newInput,
                currentOperand: null
            }

        case ACTIONS.CLEAR:
            return {};

        case ACTIONS.DELETE_DIGIT:
            if (state.newCalculation == true) {
                return {
                    ...state,
                    currentOperand: null
                }
            }
            if (state.currentOperand == null) {
                return state;
            }
            if (state.currentOperand.length == 1) {
                return {
                    ...state,
                    currentOperand: null
                }
            }
            return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1) // cut out last digit
            }
        
        case ACTIONS.EQUALS:
            if (state.previousOperand == null || state.currentOperand == null || state.operation == null){
                return state;
            }
            return {
                ...state,
                previousOperand: null,
                operation: null,
                currentOperand: evaluate(state),
                newCalculation: true
            }
  
        default:
            return state;
    }
  
  }

function evaluate({previousOperand, currentOperand, operation}) {
    const prevNumber = parseFloat(previousOperand);
    const currNumber = parseFloat(currentOperand);
    switch(operation) {
        case '+':
            return prevNumber + currNumber;
        case '-':
            return prevNumber - currNumber;
        case '*':
            return prevNumber * currNumber;
        case '÷':
            return prevNumber / currNumber;
    }
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0,
});

// don't format anything after decimal point
function formatOperand(operand) {
    if (operand == null) return ;
    const [integer, decimal] = operand.toString().split('.');
    console.log(integer);
    if (integer == null) {
        return `0.${decimal || ''}`
    }
    if (decimal == null) {
        return INTEGER_FORMATTER.format(integer);
    } else {
        return `${INTEGER_FORMATTER.format(integer)}.${decimal}`; // ${} is string interpreter
    }
}




function Calculator() {

    const [currOperandFontSize, setCurrOperandFontSize] = useState("5.2vh");
    const [{previousOperand, currentOperand, operation, newCalculation}, dispatch] = useReducer(reducer, {});
    const currOperandRef = useRef(null);
    const outputRef = useRef(null);

    function calcCurrOperandWidth () {
        // const currOperandWidth = el.offsetWidth;
        console.log(currOperandRef.current);
    }

    useEffect(() => {
        console.log(currOperandRef.current, currOperandRef.current.offsetWidth);
        console.log("output width: " + outputRef.current.offsetWidth);

        if (currOperandRef.current.offsetWidth > outputRef.current.offsetWidth) {
            setCurrOperandFontSize("3.5vh");
        }          
        if (currentOperand == null) {
            setCurrOperandFontSize("5.2vh");
        }
    }, [currentOperand])

    return (
        <div className='calculator'>
            <div ref={outputRef} className="calculator__output">
                <div className="output__previousOperand">
                    {formatOperand(previousOperand)}{operation}
                </div>
                <div ref={currOperandRef} className={currentOperand ? "output__currentInput" : "output__inputPlaceholder"} style={{ fontSize: currOperandFontSize }}>
                    {currentOperand ? formatOperand(currentOperand) : '💖💖'}
                </div>
            </div>

            <div className="calculator__keypad">
                <button onClick={() => dispatch({type: ACTIONS.CLEAR})} className="calculator__spanTwo">
                    {/* <strong>Clear</strong> */}
                    <FontAwesomeIcon icon={faHeart} style={{marginRight: '0.4em'}}></FontAwesomeIcon>
                    <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon>
                </button>
                <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>
                    <FontAwesomeIcon icon={faDeleteLeft}></FontAwesomeIcon>
                </button>
                <KeyPadOperationItem dispatch={dispatch} operand='÷'>
                    <FontAwesomeIcon icon={faDivide}></FontAwesomeIcon>
                </KeyPadOperationItem>
                <KeyPadNumberItem dispatch={dispatch} operand='7'>
                    <FontAwesomeIcon icon={fa7}></FontAwesomeIcon>
                </KeyPadNumberItem>
                <KeyPadNumberItem dispatch={dispatch} operand='8'>
                    <FontAwesomeIcon icon={fa8}></FontAwesomeIcon>
                </KeyPadNumberItem>
                <KeyPadNumberItem dispatch={dispatch} operand='9'>
                    <FontAwesomeIcon icon={fa9}></FontAwesomeIcon>
                </KeyPadNumberItem>
                <KeyPadOperationItem dispatch={dispatch} operand='*'>
                    <FontAwesomeIcon icon={faMultiply}></FontAwesomeIcon>
                </KeyPadOperationItem>
                {/* <button>
                    <FontAwesomeIcon icon={faMultiply}></FontAwesomeIcon>
                </button> */}
                <KeyPadNumberItem dispatch={dispatch} operand='4'>
                    <FontAwesomeIcon icon={fa4}></FontAwesomeIcon>
                </KeyPadNumberItem>
                <KeyPadNumberItem dispatch={dispatch} operand='5'>
                    <FontAwesomeIcon icon={fa5}></FontAwesomeIcon>
                </KeyPadNumberItem>
                <KeyPadNumberItem dispatch={dispatch} operand='6'>
                    <FontAwesomeIcon icon={fa6}></FontAwesomeIcon>
                </KeyPadNumberItem>
                <KeyPadOperationItem dispatch={dispatch} operand='-'>
                    <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
                </KeyPadOperationItem>
                <KeyPadNumberItem dispatch={dispatch} operand='1'>
                    <FontAwesomeIcon icon={fa1}></FontAwesomeIcon>
                </KeyPadNumberItem>
                <KeyPadNumberItem dispatch={dispatch} operand='2'>
                    <FontAwesomeIcon icon={fa2}></FontAwesomeIcon>
                </KeyPadNumberItem>
                <KeyPadNumberItem dispatch={dispatch} operand='3'>
                    <FontAwesomeIcon icon={fa3}></FontAwesomeIcon>
                </KeyPadNumberItem>
                <KeyPadOperationItem dispatch={dispatch} operand='+'>
                    <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                </KeyPadOperationItem>
                <KeyPadNumberItem dispatch={dispatch} operand='0'>
                    <FontAwesomeIcon icon={fa0}></FontAwesomeIcon>
                </KeyPadNumberItem>
                <KeyPadNumberItem dispatch={dispatch} operand='.'>
                    <strong>.</strong>
                </KeyPadNumberItem>

                <button onClick={() => dispatch({type: ACTIONS.EQUALS})} className='calculator__spanTwo'>
                    <FontAwesomeIcon icon={faEquals}></FontAwesomeIcon>
                </button>
                
            </div>

            <CSSTransition
                in = {newCalculation == true}
                unmountOnExit
                timeout={300}
                classNames="playBurstStars"
            >
                <div className="burstStars">
                        {/* <FontAwesomeIcon icon={faStar} color="#51ecf5" style={{stroke: '#51ecf5', strokeWidth: '20px'}}></FontAwesomeIcon> */}
                        <FontAwesomeIcon icon={faStar} color="#84f2fa"></FontAwesomeIcon>
                </div>
            </CSSTransition>

            <CSSTransition
                in = {newCalculation == true}
                unmountOnExit
                timeout={300}
                classNames="playBurstStarsTwo"
            >
                <div className="burstStars">
                        {/* <FontAwesomeIcon icon={faStar} color="#ffa6c6" style={{stroke: '#ffa6c6', strokeWidth: '20px'}}></FontAwesomeIcon> */}
                        <FontAwesomeIcon icon={faStar} color="#ffb8c9"></FontAwesomeIcon>
                </div>
            </CSSTransition>

        </div>
    )
}

export default Calculator