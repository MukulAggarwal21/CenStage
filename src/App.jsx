import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Calendar from './components/Calender';
import './App.css';

const App = () => {
  return (
    <Provider store={store}>
      <div className="app-container">
        <Calendar />
      </div>
    </Provider>
  );
};

export default App;