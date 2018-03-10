const initialState = {
  locale: "en",
  volume: 0.75,
  glow: true,
  fade: true,
  fxaa: true,
  ssao: true,
  pixelRatio: 1,
  reflections: false,
  shadowquality: 512,
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
    case "CONFIG_CHECKBOX":
      return {
        ...state,
        [action.name]: action.checked,
      }
    case "CONFIG_PIXELRATIO":
      return {
        ...state,
        pixelRatio: action.ratio,
      }
    case "CONFIG_SHADOW":
      return {
        ...state,
        shadowquality: action.quality,
      }
    default:
      return state
  }
}

export default config
