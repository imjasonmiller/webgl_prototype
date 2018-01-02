export const windowScroll = scrollHeight => ({
  type: "WINDOW_SCROLL",
  scrollHeight,
})

export const resizeWindow = (width, height, pixelRatio) => ({
  type: "WINDOW_RESIZE",
  width,
  height,
  pixelRatio,
})
