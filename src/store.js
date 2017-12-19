/* eslint no-underscore-dangle: 0, global-require: 0 */
import { applyMiddleware, compose, createStore } from "redux"
import rootSaga from "sagas"
import rootReducer from "reducers"
import createSagaMiddleware from "redux-saga"

const sagaMiddleware = createSagaMiddleware()
const enhancer = compose(
  applyMiddleware(sagaMiddleware),
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : f => f,
)

const configureStore = initialState => {
  const store = createStore(rootReducer, initialState, enhancer)

  sagaMiddleware.run(rootSaga)

  // Webpack Hot Module Replacement
  if (module.hot) {
    module.hot.accept("reducers", () => {
      const nextRootReducer = require("reducers/index")
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

export default configureStore
