export const modifyTerrain = terrain => ({
  type: "TERRAIN_MODIFY",
  terrain,
})

export const changeLocale = locale => ({
  type: "LOCALE_CHANGE",
  locale,
})
