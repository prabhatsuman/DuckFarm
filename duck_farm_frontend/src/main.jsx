import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { refreshToken } from "./utils/auth";
import { BrowserRouter } from "react-router-dom";
if (!import.meta.env.DEV) {
  console.log = function () {};
}

const REFRESH_INTERVAL = 19 * 60 * 1000;

setInterval(refreshToken, REFRESH_INTERVAL);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
