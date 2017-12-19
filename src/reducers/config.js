const initialState = {
  locale: "en",
  volume: 0.75,
}

const config = (state = initialState, action) => {
  switch (action.type) {
    case "CONFIG_LOCALE":
      return {
        ...state,
        locale: action.locale,
      }
    case "CONFIG_VOLUME":
      return {
        ...state,
        volume: action.volume,
      }
    default:
      return state
  }
}

export default config
