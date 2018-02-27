import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import styled from "styled-components"
import Animated from "animated/lib/targets/react-dom"

import HairData from "static/avatar/hair"

import { incrementUID } from "actions/window"

import interpolatePath from "./InterpolatePath"

const Hair = styled.svg`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

class AvatarViewHair extends Component {
  constructor(props) {
    super(props)

    const { hairColor, hairOption } = props

    this.hairAnimVal = new Animated.Value(0)

    this.clipHairPrevContent = HairData.options[hairOption].data(
      HairData.colors[hairColor],
    )
    this.clipHairNextContent = HairData.options[hairOption].data(
      HairData.colors[hairColor],
    )
  }

  componentDidMount() {
    this.props.dispatch(incrementUID())

    // Get the initial path data for clipping paths
    this.clipHairHidePath = this.clipHairHide.getAttribute("d")
    this.clipHairShowPath = this.clipHairHide.getAttribute("d")

    this.hairAnimListener = this.hairAnimVal.addListener(({ value }) => {
      this.clipHairHide.setAttribute(
        "d",
        interpolatePath(
          value,
          this.clipHairHidePath,
          "M0,500c0,0,500,0,500,0V0H0v500z",
        ),
      )
      this.clipHairShow.setAttribute(
        "d",
        interpolatePath(
          value,
          this.clipHairShowPath,
          "M0,505c0,0,500,0,500,0V0H0v505z",
        ),
      )
    })
  }

  shouldComponentUpdate(nextProps) {
    if (
      this.props.hairColor !== nextProps.hairColor ||
      this.props.hairOption !== nextProps.hairOption
    ) {
      this.clipHairHide.setAttribute(
        "d",
        "M0,-100c0,100,500,100,500,0V-100H0v250z",
      )
      this.clipHairShow.setAttribute(
        "d",
        "M0,-95c0,100,500,100,500,0V-95H0v250z",
      )

      const prevColor = HairData.colors[this.props.hairColor]
      const nextColor = HairData.colors[nextProps.hairColor]

      const prevOption = this.props.hairOption
      const nextOption = nextProps.hairOption

      this.hairAnimVal.setValue(0)

      this.clipHairPrevContent = HairData.options[prevOption].data(prevColor)
      this.clipHairNextContent = HairData.options[nextOption].data(nextColor)

      // Update component
      return true
    }

    return false
  }

  componentWillUpdate() {
    Animated.spring(this.hairAnimVal, {
      toValue: 1,
      tension: 3,
      friction: 10,
    }).start()
    // Animated.timing(this.hairAnimVal, { duration: 4000, toValue: 1 }).start()
  }

  render() {
    const clipHairShow = `clip-hair-show-${this.props.uid}`
    const clipHairHide = `clip-hair-hide-${this.props.uid}`

    return (
      <Hair viewBox="0 0 500 500">
        <defs>
          <mask id={clipHairShow}>
            <rect x="0" y="0" width="500" height="500" fill="#000" />
            <path
              className="clip-hair-shape"
              d="M0,-95c0,100,500,100,500,0V-95H0v250z"
              fill="#fff"
              ref={c => {
                this.clipHairShow = c
              }}
            />
          </mask>
          <mask id={clipHairHide}>
            <rect x="0" y="0" width="500" height="500" fill="#fff" />
            <path
              className="clip-hair-shape"
              d="M0,-100c0,100,500,100,500,0V-100H0v250z"
              fill="#000"
              ref={c => {
                this.clipHairHide = c
              }}
            />
          </mask>
        </defs>
        <g
          mask={`url(#${clipHairHide})`}
          ref={c => {
            this.clipHairPrev = c
          }}
        >
          {this.clipHairPrevContent}
        </g>
        <g
          mask={`url(#${clipHairShow})`}
          ref={c => {
            this.clipHairNext = c
          }}
        >
          {this.clipHairNextContent}
        </g>
      </Hair>
    )
  }
}

AvatarViewHair.propTypes = {
  dispatch: PropTypes.func.isRequired,
  hairColor: PropTypes.number.isRequired,
  hairOption: PropTypes.number.isRequired,
  uid: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  hairColor: state.player.hairColor,
  hairOption: state.player.hairOption,
  uid: state.window.uid,
})

export default connect(mapStateToProps)(AvatarViewHair)
