export const checkboxConfig = (name, checked) => ({
  type: "CONFIG_CHECKBOX",
  name,
  checked,
})

export const pixelRatioConfig = ratio => ({
  type: "CONFIG_PIXELRATIO",
  ratio,
})

export const shadowConfig = quality => ({
  type: "CONFIG_SHADOW",
  quality,
})

export const localeConfig = locale => ({
  type: "CONFIG_LOCALE",
  locale,
})

export const volumeConfig = volume => ({
  type: "CONFIG_VOLUME",
  volume,
})
