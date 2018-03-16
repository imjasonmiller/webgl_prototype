import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"

import App from "./containers/App"

import configureStore from "./store"

const state = window.initialState || {}

// Garbage collect state
delete window.initialState

const store = configureStore(state)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root"),
)
