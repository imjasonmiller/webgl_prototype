import { take, call, put } from "redux-saga/effects"
/**
 * Create an authentication token
 * @param {*} user - Username
 * @param {*} pass - Password
 */
const createToken = (user, pass) =>
  fetch(`http://${APP_HOST}:${APP_PORT}/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({ user, pass }),
  })
    .then(res => res.json())
    .catch(err => {
      throw err
    })

/**
 * Delete an authenitication token
 */
const deleteToken = () =>
  fetch(`http://${APP_HOST}:${APP_PORT}/api/token`, {
    method: "DELETE",
    headers: {
      xsrf: document.cookie.substr(5),
    },
    credentials: "same-origin",
  }).catch(err => {
    throw err
  })

// eslint-disable-next-line
export function* authorize(user, pass) {
  try {
    const token = yield call(createToken, user, pass)
    yield put({ type: "LOGIN_SUCCESS", authenticated: true })
    return token
  } catch (err) {
    yield put({ type: "LOGIN_ERROR", err })
  }
}

export function* loginFlow() {
  while (true) {
    const { user, pass } = yield take("LOGIN_REQUEST")
    yield call(authorize, user, pass)
  }
}

export function* logoutFlow() {
  while (true) {
    yield take("LOGOUT_REQUEST")
    yield call(deleteToken)
    yield put({ type: "LOGOUT_SUCCESS", authenticated: false })
  }
}
