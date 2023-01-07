import React from "react";
import ReactDOM from "react-dom";
import { DBPContextProvider } from "./context/DBPContext";

import App from "./NBAtool";

import "./index.css";
import "./select.css";
import { GamelogContextProvider } from "./context/GamelogContext";
import { PBPContextProvider } from "./context/PBPContext";

//import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <PBPContextProvider>
      <DBPContextProvider>
        <GamelogContextProvider>
          <App />
        </GamelogContextProvider>
      </DBPContextProvider>
    </PBPContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
