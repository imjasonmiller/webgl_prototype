const initialState = {
  width: 0,
  height: 0,
  pixelRatio: 0,
}

const window = (state = initialState, action) => {
  switch (action.type) {
    case "WINDOW_RESIZE":
      return {
        ...state,
        width: action.width,
        height: action.height,
        pixelRatio: action.pixelRatio,
      }
    default:
      return state
  }
}

export default window
