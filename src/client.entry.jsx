import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { AppContainer } from "react-hot-loader"
import { Provider } from "react-redux"

import App from "./containers/App"

import configureStore from "./store"

const state = window.initialState || {}
const store = configureStore(state)

const hydrate = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <AppContainer warnings={false}>
          <Component />
        </AppContainer>
      </BrowserRouter>
    </Provider>,
    document.getElementById("root"),
  )
}

hydrate(App)

// Webpack Hot Module Replacement
if (module.hot) {
  module.hot.accept("./containers/App", () => {
    hydrate(App)
  })
}
