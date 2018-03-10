const initialState = {
  authenticated: false,
  loadComplete: false,
  loadProgress: 0,
  terrain: Array(841).fill(0),
  serverTime: Date.now(),
  cameraRotation: 0,
  faceColor: 0,
  faceOption: 0,
  hairColor: 0,
  hairOption: 0,
  itemColor: 0,
  itemOption: 0,
  wearColor: 0,
  wearOption: 0,
  tool: "SELECT",
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
    case "LOAD_COMPLETE":
      return {
        ...state,
        loadComplete: true,
      }
    case "LOAD_PROGRESS":
      return {
        ...state,
        loadProgress: action.progress,
      }
    case "TOOL_CHANGE":
      return {
        ...state,
        tool: action.tool,
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
    case "CHANGE_AVATAR_FACE_COLOR":
      return {
        ...state,
        faceColor: action.color,
      }
    case "CHANGE_AVATAR_FACE_OPTION":
      return {
        ...state,
        faceOption: action.option,
      }
    case "CHANGE_AVATAR_HAIR_COLOR":
      return {
        ...state,
        hairColor: action.color,
      }
    case "CHANGE_AVATAR_HAIR_OPTION":
      return {
        ...state,
        hairOption: action.option,
      }
    case "CHANGE_AVATAR_ITEM_COLOR":
      return {
        ...state,
        itemColor: action.color,
      }
    case "CHANGE_AVATAR_ITEM_OPTION":
      return {
        ...state,
        itemOption: action.option,
      }
    case "CHANGE_AVATAR_WEAR_COLOR":
      return {
        ...state,
        wearColor: action.color,
      }
    case "CHANGE_AVATAR_WEAR_OPTION":
      return {
        ...state,
        wearOption: action.option,
      }
    default:
      return state
  }
}

export default player
