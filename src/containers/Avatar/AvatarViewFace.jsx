import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import styled from "styled-components"
import Animated from "animated/lib/targets/react-dom"

import FaceData from "static/avatar/face"

import { changeAvatarFaceOption } from "actions/player"
import { incrementUID } from "actions/window"

const Face = styled.svg`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const Mouth = styled.path`
  opacity: 0.25;
  fill: none;
  stroke: #000;
  stroke-width: 10;
  stroke-linecap: round;
`
const Nose = Mouth.extend``
const EyebrowLeft = Mouth.extend``
const EyebrowRight = Mouth.extend``

class AvatarViewFace extends Component {
  /**
   * Interpolate between source and target path data
   * Shorthand notation does not yet work. Delimit all
   * values with a comma — e.g. "32.5,-7", not "32.5-7"
   * @param {Number} value  Source to target interpolation, ranges from 0–1
   * @param {String} source Source path data
   * @param {String} target Target path data
   */
  static interpolatePath(value, source, target) {
    // RegEx for number (positions) and non-number (commands) path data
    const NaNExp = /[^\de\-.]/g
    const NumExp = /(-)?(\d|e|\.)+/g

    const commands = source.match(NaNExp)
    const sourcePos = source.match(NumExp)
    const targetPos = target.match(NumExp)

    const tween = []

    for (let i = 0; i < sourcePos.length; i += 1) {
      const command = commands[i]

      // prettier-ignore
      const position = parseFloat(sourcePos[i]) + (
        parseFloat(targetPos[i]) - parseFloat(sourcePos[i])
      ) * value

      tween.push(command + position.toFixed(3))
    }

    return tween.join("")
  }

  constructor() {
    super()
    this.optionAnimVal = new Animated.Value(0)
  }

  componentDidMount() {
    // See clipFaceShow and clipFaceHide as to why this is necessary
    this.props.dispatch(incrementUID())

    window.changeAvatar = option => {
      this.props.dispatch(changeAvatarFaceOption(option))
    }

    this.mouthPath = this.mouth.getAttribute("d")
    this.optionAnimListener = this.optionAnimVal.addListener(({ value }) => {
      this.mouth.setAttribute(
        "d",
        this.constructor.interpolatePath(
          value,
          this.mouthPath,
          FaceData.options[this.props.option].mouth,
        ),
      )

      this.eyebrowLeft.setAttribute(
        "d",
        this.constructor.interpolatePath(
          value,
          this.eyebrowLeftPath,
          FaceData.options[this.props.option].eyebrowLeft,
        ),
      )

      this.eyebrowRight.setAttribute(
        "d",
        this.constructor.interpolatePath(
          value,
          this.eyebrowRightPath,
          FaceData.options[this.props.option].eyebrowRight,
        ),
      )
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.option !== nextProps.option) {
      // Set to current values, we will animate from these values
      this.mouthPath = this.mouth.getAttribute("d")
      this.eyebrowLeftPath = this.eyebrowLeft.getAttribute("d")
      this.eyebrowRightPath = this.eyebrowRight.getAttribute("d")

      // Value to 0 as we are starting a new animation
      this.optionAnimVal.setValue(0)

      Animated.spring(this.optionAnimVal, {
        toValue: 1,
        speed: 1,
        bounciness: 10,
      }).start()
    }
  }

  componentWillUnmount() {
    this.optionAnimVal.removeListener(this.optionAnimListener)
  }

  render() {
    const { color, option, uid } = this.props

    // Multiple instances of the component are renderered at the same time. This means unique IDs are
    // needed to prevent each <svg /> <mask /> from influencing the other component and disappearing
    const clipFaceShow = `clip-face-show-${uid}`
    const clipFaceHide = `clip-face-hide-${uid}`

    return (
      <Face viewBox="0 0 500 500">
        <defs>
          <mask id={clipFaceShow}>
            <rect x="0" y="0" width="500" height="500" fill="#000" />
            <circle
              cx="250"
              cy="250"
              r="250"
              fill="#fff"
              ref={c => {
                this.clipFaceShow = c
              }}
            />
          </mask>
          <mask id={clipFaceHide}>
            <rect x="0" y="0" width="500" height="500" fill="#fff" />
            <circle
              cx="250"
              cy="250"
              r="250"
              fill="#000"
              ref={c => {
                this.clipFaceHide = c
              }}
            />
          </mask>
        </defs>
        <g>
          <path
            d="M370,215.6v-18.1c0-66.3-53.7-120-120-120s-120,53.7-120,120v18.1c-15.9,0-28.8,12.9-28.8,28.8
            c0,15.9,12.9,28.8,28.8,28.8v44.3c0,66.3,53.7,120,120,120s120-53.7,120-120v-44.3c15.9,0,28.8-12.9,28.8-28.8
            C398.8,228.5,385.9,215.6,370,215.6z"
            fill={FaceData.colors[color]}
          />
        </g>
        <circle fill="#fff" cx="187.4" cy="240.2" r="25" />
        <circle cx="187.4" cy="240.2" r="12.5" />
        <circle fill="#fff" cx="174.9" cy="240.2" r="7.5" />
        <EyebrowLeft
          d={FaceData.options[option].eyebrowLeft}
          innerRef={c => {
            this.eyebrowLeft = c
          }}
        />
        <circle fill="#fff" cx="312.4" cy="240.2" r="25" />
        <circle cx="312.4" cy="240.2" r="12.5" />
        <circle fill="#fff" cx="299.9" cy="240.2" r="7.5" />
        <EyebrowRight
          d={FaceData.options[option].eyebrowRight}
          innerRef={c => {
            this.eyebrowRight = c
          }}
        />
        <Nose d="M232,288.5c10,9.9,26,9.9,36-0.1" />
        <Mouth
          d={FaceData.options[option].mouth}
          innerRef={c => {
            this.mouth = c
          }}
        />
      </Face>
    )
  }
}

AvatarViewFace.propTypes = {
  color: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  option: PropTypes.number.isRequired,
  uid: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  color: state.player.faceColor,
  option: state.player.faceOption,
  uid: state.window.uid,
})

export default connect(mapStateToProps)(AvatarViewFace)
