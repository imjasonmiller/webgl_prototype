import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import styled from "styled-components"
import { ColorPicker, OptionPicker, Pagination } from "containers"
import { changeAvatarFaceColor, changeAvatarFaceOption } from "actions/player"

import FaceData from "static/avatar/face"

const ColorSVG = styled.svg`
  display: block;
  width: 100%;
  box-sizing: border-box;
  background: ${props => props.color};
  border-radius: 50%;
  border: ${props => `3px solid ${props.theme.whitesmoke}`};
  cursor: pointer;
`

const OptionSVG = styled.svg`
  display: block;
  width: 100%;
  box-sizing: border-box;
  background: ${props => props.theme.whitesmoke};
  border-radius: 5%;
  border: ${props => `3px solid ${props.theme.whitesmoke}`};
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

    // Length of all the colors and options
    this.colorsLength = FaceData.colors.length
    this.optionsLength = FaceData.options.length

    this.handlePrevOptions = this.handlePrevOptions.bind(this)
    this.handleNextOptions = this.handleNextOptions.bind(this)
  }

  handleColor(color) {
    this.props.dispatch(changeAvatarFaceColor(color))
  }

  handleOption(option) {
    this.props.dispatch(changeAvatarFaceOption(option))
  }

  handlePrevColors() {
    if (this.state.colorPickerIndex > 0) {
      this.setState({
        colorPickerIndex: this.state.colorPickerIndex - 1,
      })
    }
  }

  handleNextColors() {
    if (this.state.colorPickerIndex + 1 < this.colorsLength / 6) {
      this.setState({
        colorPickerIndex: this.state.colorPickerIndex + 1,
      })
    }
  }

  handlePrevOptions() {
    if (this.state.optionPickerIndex > 0) {
      this.setState({
        optionPickerIndex: this.state.optionPickerIndex - 1,
      })
    }
  }

  handleNextOptions() {
    if (this.state.optionPickerIndex + 1 < this.optionsLength / 3) {
      this.setState({
        optionPickerIndex: this.state.optionPickerIndex + 1,
      })
    }
  }

  render() {
    const colorsStart = 6 * this.state.colorPickerIndex
    const colorsEnd = 6 + colorsStart

    const Colors = FaceData.colors
      .slice(colorsStart, colorsEnd)
      .map((color, index) => (
        <ColorSVG
          viewBox="0 0 10 10"
          key={color}
          color={color}
          onClick={() =>
            this.handleColor(index + this.state.colorPickerIndex * 6)
          }
        >
          <circle fill={color} />
        </ColorSVG>
      ))

    const optionsStart = 3 * this.state.optionPickerIndex
    const optionsEnd = 3 + optionsStart

    const Options = FaceData.options
      .slice(optionsStart, optionsEnd)
      .map((option, index) => (
        <OptionSVG
          viewBox="0 0 500 500"
          key={option.key}
          onClick={() =>
            this.handleOption(index + this.state.colorPickerIndex * 6)
          }
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

    return (
      <div>
        <OptionPicker>{Options}</OptionPicker>
        <Pagination
          handlePrev={() => this.handlePrevOptions()}
          handleNext={() => this.handleNextOptions()}
          listIndex={this.state.optionPickerIndex}
          listLength={3}
          totalLength={this.optionsLength}
        />
        <ColorPicker>{Colors}</ColorPicker>
        <Pagination
          handlePrev={() => this.handlePrevColors()}
          handleNext={() => this.handleNextColors()}
          listIndex={this.state.colorPickerIndex}
          listLength={6}
          totalLength={this.colorsLength}
        />
      </div>
    )
  }
}

AvatarEditFace.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

export default connect()(AvatarEditFace)
