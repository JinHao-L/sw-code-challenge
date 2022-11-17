import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <React.StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      draggable
      hideProgressBar
      pauseOnHover
      closeOnClick={false}
      theme="light"
    />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
