const initialState = {
  authenticated: false,
  terrain: Array(841).fill(0),
  serverTime: Date.now(),
  cameraRotation: 0,
  faceColor: 0,
  faceOption: 0,
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
    case "CHANGE_LOCALE":
      return {
        ...state,
        locale: action.locale,
      }
    case "CAMERA_ROTATION":
      return {
        ...state,
        cameraRotation: state.cameraRotation + 90,
      }
    case "MODIFY_TERRAIN":
      return {
        ...state,
        terrain: action.terrain,
      }
    case "SERVER_TIME":
      return {
        ...state,
        serverTime: action.time,
      }
    case "CHANGE_AVATAR_FACE_OPTION":
      return {
        ...state,
        faceOption: action.option,
      }
    case "CHANGE_AVATAR_FACE_COLOR":
      return {
        ...state,
        faceColor: action.color,
      }
    default:
      return state
  }
}

export default player
