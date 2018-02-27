/**
 * Interpolate between source and target path data
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
 * @param {Number} value  Source to target interpolation, ranges from 0–1
 * @param {String} source Source path data
 * @param {String} target Target path data
 */
const interpolatePath = (value, source, target) => {
  // RegEx for number (source and target) and non-number (commands) path data
  const NaNExp = /[^\de\-.]/g
  const NumExp = /(-)?(\d|e|\.)+/g

  const commands = source.match(NaNExp)
  const sourceArr = source.match(NumExp)
  const targetArr = target.match(NumExp)

  const tween = []

  for (let i = 0; i < sourceArr.length; i += 1) {
    const command = commands[i]

    const sourcePos = parseFloat(sourceArr[i])
    const targetPos = parseFloat(targetArr[i])

    const result = sourcePos + (targetPos - sourcePos) * value

    tween.push(command + result.toFixed(3))
  }

  return tween.join("")
}

export default interpolatePath
