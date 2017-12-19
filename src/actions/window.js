export const windowScroll = scrollHeight => ({
  type: "WINDOW_SCROLL",
  scrollHeight,
})

export const windowResize = (width, height, pixelRatio) => ({
  type: "WINDOW_RESIZE",
  width,
  height,
  pixelRatio,
})
