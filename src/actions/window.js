export const incrementUID = () => ({
  type: "INCREMENT_UID",
})

export const resizeWindow = (width, height, pixelRatio) => ({
  type: "WINDOW_RESIZE",
  width,
  height,
  pixelRatio,
})

export const windowScroll = scrollHeight => ({
  type: "WINDOW_SCROLL",
  scrollHeight,
})
