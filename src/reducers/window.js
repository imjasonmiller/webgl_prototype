const initialState = {
  uid: 0,
  width: 0,
  height: 0,
  pixelRatio: 0,
  modalHeight: 0,
  modalScroll: 0,
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
    case "INCREMENT_UID":
      return {
        ...state,
        uid: state.uid + 1,
      }
    case "MODAL_UPDATE":
      return {
        ...state,
        modalScroll: action.scroll,
        modalHeight: action.height,
      }
    default:
      return state
  }
}

export default window
