export const incrementUID = () => ({
  type: "INCREMENT_UID",
})

export const resizeWindow = (width, height, pixelRatio) => ({
  type: "WINDOW_RESIZE",
  width,
  height,
  pixelRatio,
})

export const updateModal = (scroll, height) => ({
  type: "MODAL_UPDATE",
  scroll,
  height,
})

export const windowScroll = scroll => ({
  type: "WINDOW_SCROLL",
  scroll,
})
