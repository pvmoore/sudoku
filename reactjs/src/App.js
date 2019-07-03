import React from 'react';
import Sudoku from "./sudoku-components/Sudoku";
import { Provider } from "react-redux";
import store from "./sudoku-components/redux/store";

import './App.css';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <Sudoku />
        </Provider>
      </div>
    );
  }
}

// function App() {
//   return (
//     <div className="App">
//       <h1 id="heading">Sudoku (React)</h1>
//     </div>
//   );
// }

export default App;

/** HTMLCollection.forEach(value) */
Object.defineProperties(HTMLCollection.prototype, {
  forEach: {
    value: function (f) {
      for(let i = 0; i < this.length; i++) {
        f(this[i]);
      }
    }
  }
});

/** Array.prototype.remove(value) */
Object.defineProperties(Array.prototype, {
  remove: {
    value: function (value) {
      const i = this.indexOf(value);
      if(i !== -1) {
        this.splice(i, 1);
        return true;
      }
      return false;
    }
  },
  // count: {
  //     value: function (value) {
  //         var count = 0;
  //         for(let i = 0; i < this.length; i++)
  //           if(this[i] === value)
  //               count++;
  //         return count;
  //     }
  // }
});