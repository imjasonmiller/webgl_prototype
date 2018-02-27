import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import styled from "styled-components"
import Animated from "animated/lib/targets/react-dom"

import FaceData from "static/avatar/face"

import { changeAvatarFaceColor, changeAvatarFaceOption } from "actions/player"
import { incrementUID } from "actions/window"

import interpolatePath from "./InterpolatePath"

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
  constructor() {
    super()

    this.colorAnimVal = new Animated.Value(0)
    this.optionAnimVal = new Animated.Value(0)
  }

  componentDidMount() {
    // Multiple instances of the component are renderered at the same time. This means unique IDs are
    // needed to prevent each <svg /> <mask /> from influencing the other component and disappearing
    this.props.dispatch(incrementUID())

    // Get initial mouth path data
    this.mouthPath = this.mouth.getAttribute("d")

    this.colorAnimListener = this.colorAnimVal.addListener(({ value }) => {
      // The mask's scale needs to be (0, 0) when the value is at 1.
      // The x, y scale are inverted using scale - value * scale
      // It will then move from (250, 275) to (0, 0)
      this.clipFaceHide.setAttribute(
        "transform",
        `matrix(${value}, 0, 0, ${value}, ${250 - value * 250}, ${275 -
          value * 275})`,
      )
      this.clipFaceShow.setAttribute(
        "transform",
        `matrix(${value}, 0, 0, ${value}, ${250 - value * 250}, ${275 -
          value * 275})`,
      )
    })

    this.optionAnimListener = this.optionAnimVal.addListener(({ value }) => {
      this.mouth.setAttribute(
        "d",
        interpolatePath(
          value,
          this.mouthPath,
          FaceData.options[this.props.option].mouth,
        ),
      )

      this.eyebrowLeft.setAttribute(
        "d",
        interpolatePath(
          value,
          this.eyebrowLeftPath,
          FaceData.options[this.props.option].eyebrowLeft,
        ),
      )

      this.eyebrowRight.setAttribute(
        "d",
        interpolatePath(
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

    if (this.props.color !== nextProps.color) {
      /**
       * Firefox seems to not accept a CSS scale transformation
       * @see https://bugzilla.mozilla.org/show_bug.cgi?id=1118710
       * It does accept the following matrix transform attribute:
       * matrix(sx, 0, 0, sy, cx - sx * cx, cy - sy * cy)
       * sx and sy are for scale in the y- and x-axis and
       * cx and cy are for the translation coordinates
       * @see http://stackoverflow.com/a/6714140/1113913
       */

      // Scale both masks to 0 and translate to center (250, 275)
      this.clipFaceHide.setAttribute(
        "transform",
        "matrix(0, 0, 0, 0, 250, 275)",
      )
      this.clipFaceShow.setAttribute(
        "transform",
        "matrix(0, 0, 0, 0, 250, 275)",
      )

      this.clipFacePrev.setAttribute("fill", FaceData.colors[this.props.color])
      this.clipFaceNext.setAttribute("fill", FaceData.colors[nextProps.color])

      // Value to 0 as we are starting a new animation
      this.colorAnimVal.setValue(0)

      Animated.spring(this.colorAnimVal, {
        toValue: 1,
        tension: 1,
        friction: 10,
      }).start()
    }
  }

  shouldComponentUpdate() {
    // Due to heavy DOM manipulation the component is
    // updated manually via componentWillReceiveProps
    return false
  }

  componentWillUnmount() {
    this.optionAnimVal.removeListener(this.optionAnimListener)
  }

  render() {
    const { color, option, uid } = this.props

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
            mask={`url(#${clipFaceHide})`}
            ref={c => {
              this.clipFacePrev = c
            }}
          />
          <path
            d="M370,215.6v-18.1c0-66.3-53.7-120-120-120s-120,53.7-120,120v18.1c-15.9,0-28.8,12.9-28.8,28.8
            c0,15.9,12.9,28.8,28.8,28.8v44.3c0,66.3,53.7,120,120,120s120-53.7,120-120v-44.3c15.9,0,28.8-12.9,28.8-28.8
            C398.8,228.5,385.9,215.6,370,215.6z"
            fill={FaceData.colors[color]}
            mask={`url(#${clipFaceShow})`}
            ref={c => {
              this.clipFaceNext = c
            }}
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
