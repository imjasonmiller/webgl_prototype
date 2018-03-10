import { all } from "redux-saga/effects"
import { loginFlow, logoutFlow } from "./auth"

export default function* rootSaga() {
  yield all([loginFlow(), logoutFlow()])
}
