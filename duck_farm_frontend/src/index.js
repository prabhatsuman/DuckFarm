import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { refreshToken } from './utils/auth';

// Set up a refresh interval (e.g., every 20 minutes, before the token expires)
const REFRESH_INTERVAL = 20 * 60 * 1000; // 20 minutes in milliseconds

setInterval(refreshToken, REFRESH_INTERVAL);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
