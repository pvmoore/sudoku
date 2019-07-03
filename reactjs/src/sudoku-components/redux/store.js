import { createStore } from "redux";
import sudokuReducer from "./reducer";

const store = createStore(sudokuReducer);

export default store;

