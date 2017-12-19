import { loginFlow, logoutFlow } from "./auth"

export default function* rootSaga() {
  yield [loginFlow(), logoutFlow()]
}
