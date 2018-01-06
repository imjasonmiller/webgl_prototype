import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import styled from "styled-components"
import { OptionPicker } from "containers"
import { changeAvatarFaceColor, changeAvatarFaceOption } from "actions/player"

import FaceData from "static/avatar/face"

const OptionSVG = styled.svg`
  display: block;
  width: 100%;
  background: ${props => props.theme.whitesmoke};
  border-radius: 5%;
  cursor: pointer;
`

const OptionPath = styled.path`
  fill: none;
  stroke: ${props => props.theme.silver};
  stroke-width: 20;
  stroke-linecap: round;
`

const OptionCircle = styled.circle`
  fill: ${props => props.theme.silver};
  stroke: ${props => props.theme.silver};
`

class AvatarEditFace extends Component {
  constructor() {
    super()
    this.state = {
      colorPickerIndex: 0,
      optionPickerIndex: 0,
    }

    this.handlePrevOptions = this.handlePrevOptions.bind(this)
    this.handleNextOptions = this.handleNextOptions.bind(this)
  }

  handleOption(option) {
    this.props.dispatch(changeAvatarFaceOption(option))
  }
  handlePrevOptions() {}

  handleNextOptions() {}

  render() {
    const Options = FaceData.options.map((option, index) => (
      <OptionSVG
        viewBox="0 0 500 500"
        key={option.key}
        onClick={() => this.handleOption(index)}
      >
        {/* prettier-ignore */}
        <OptionPath d="
          M370,215.6
          v-18.1c0-66.3-53.7-120-120-120s-120,53.7-120,120
          v18.1
          c-15.9,0-28.8,12.9-28.8,28.8
          c0,15.9,12.9,28.8,28.8,28.8
          v44.3c0,66.3,53.7,120,120,120
          s120-53.7,120-120
          v-44.3c15.9,0,28.8-12.9,28.8-28.8
          C398.8,228.5,385.9,215.6,370,215.6z"
        />
        <OptionPath d={option.nose} />
        <OptionPath d={option.mouth} />
        <OptionPath d={option.eyebrowLeft} />
        <OptionPath d={option.eyebrowRight} />
        <OptionCircle cx="187.4" cy="248.2" r="15" />
        <OptionCircle cx="312.4" cy="248.2" r="15" />
      </OptionSVG>
    ))

    return <OptionPicker>{Options}</OptionPicker>
  }
}

AvatarEditFace.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

export default connect()(AvatarEditFace)
