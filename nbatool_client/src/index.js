import React from "react";
import ReactDOM from "react-dom";
import { DBPContextProvider } from "./context/DBPContext";

import App from "./NBAtool";

import "./index.css";
import "react-select-search/style.css";
import "./select.css";

//import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <DBPContextProvider>
      <App />
    </DBPContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
