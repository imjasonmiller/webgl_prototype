export const changeLocale = locale => ({
  type: "LOCALE_CHANGE",
  locale,
})

export const modifyTerrain = terrain => ({
  type: "TERRAIN_MODIFY",
  terrain,
})

export const rotateCamera = () => ({
  type: "CAMERA_ROTATION",
})
