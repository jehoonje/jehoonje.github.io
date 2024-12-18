// src/store.js
import { createStore } from 'redux';
import { combineReducers } from 'redux';

// 예시 리듀서
const initialState = {
  count: 0,
};

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  counter: counterReducer,
  // 다른 리듀서들을 여기에 추가할 수 있습니다.
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
