import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "./scss/main.scss";
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GlobalContextProvider } from './context';
import "./i18n/i18n";

ReactDOM.render(
  <GlobalContextProvider>
    <App />
  </GlobalContextProvider>,
  document.getElementById('root')
);

reportWebVitals();