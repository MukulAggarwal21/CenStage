// src/redux/store.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk'; // Use named import
import goalsReducer from './reducers/goalsReducer';
import tasksReducer from './reducers/tasksReducer';
import eventsReducer from './reducers/eventsReducer';

const rootReducer = combineReducers({
  goals: goalsReducer,
  tasks: tasksReducer,
  events: eventsReducer
});

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);