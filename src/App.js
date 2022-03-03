import { useReducer } from 'react';
import './App.css';
import Calculator from './Calculator';

function App() {

  return (
    <div className="App">
      <div className="container">
        <h2 className="container__header">
          CALCULATOR!
        </h2>

        <div className="container__calculator">
          <Calculator />
        </div>
      </div>
    </div>
  );
}

export default App;
