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

export const modifyTerrain = terrain => ({
  type: "TERRAIN_MODIFY",
  terrain,
})

export const rotateCamera = () => ({
  type: "CAMERA_ROTATION",
})
