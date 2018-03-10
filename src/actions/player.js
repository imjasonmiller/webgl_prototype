export const logout = () => ({
  type: "LOGOUT_SUCCESS",
  authenticated: false,
})

export const changeAvatarFaceColor = color => ({
  type: "CHANGE_AVATAR_FACE_COLOR",
  color,
})

export const changeAvatarFaceOption = option => ({
  type: "CHANGE_AVATAR_FACE_OPTION",
  option,
})

export const changeAvatarHairColor = color => ({
  type: "CHANGE_AVATAR_HAIR_COLOR",
  color,
})

export const changeAvatarHairOption = option => ({
  type: "CHANGE_AVATAR_HAIR_OPTION",
  option,
})

export const changeAvatarItemColor = color => ({
  type: "CHANGE_AVATAR_ITEM_COLOR",
  color,
})

export const changeAvatarItemOption = option => ({
  type: "CHANGE_AVATAR_ITEM_OPTION",
  option,
})

export const changeAvatarWearColor = color => ({
  type: "CHANGE_AVATAR_WEAR_COLOR",
  color,
})

export const changeAvatarWearOption = option => ({
  type: "CHANGE_AVATAR_WEAR_OPTION",
  option,
})

export const modifyTerrain = terrain => ({
  type: "TERRAIN_MODIFY",
  terrain,
})

export const rotateCamera = () => ({
  type: "CAMERA_ROTATION",
})

export const loadComplete = () => ({
  type: "LOAD_COMPLETE",
})

export const loadProgress = progress => ({
  type: "LOAD_PROGRESS",
  progress,
})
