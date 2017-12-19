const initialState = {
  authenticated: false,
  cameraRotation: 0,
}

const player = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        authenticated: true,
      }
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        authenticated: false,
      }
    default:
      return state
  }
}

export default player
