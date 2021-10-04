import { StylesProvider } from "@material-ui/core";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import store, { persistor } from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import LocalStorageUtils from "./utils/LocalStorageUtils";

LocalStorageUtils.setAccessToken(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTRkOTJhMmFiNmIxZTEyODBhYzVkYWEiLCJhY3RpdmUiOnRydWUsImlzQWRtaW4iOnRydWUsImlzS2V5QWRtaW4iOnRydWUsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjMzMzM5NTg3LCJleHAiOjMxNjMzMzM5NTg3fQ.WYtysmMXuBdqUSFotZvWsVL0loI8ToqTx9d_cdkQRgo"
);

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <StylesProvider injectFirst>
            <App />
          </StylesProvider>
        </PersistGate>
      </Provider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
