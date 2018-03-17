import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { ColorPicker, OptionPicker, Pagination } from "containers"
import { changeAvatarFaceColor, changeAvatarFaceOption } from "actions/player"

import Option from "components/Avatar/Option"

import FaceData from "static/avatar/face"

import AvatarEdit from "./AvatarEdit"

class AvatarEditFace extends Component {
  constructor() {
    super()

    this.handleColor = this.handleColor.bind(this)
  }

  handleColor(color) {
    this.props.dispatch(changeAvatarFaceColor(color))
  }

  handleOption(option) {
    this.props.dispatch(changeAvatarFaceOption(option))
  }

  render() {
    const {
      colorsPageIndex,
      colorsPageLength,
      faceColor,
      faceOption,
      optionsPageIndex,
      optionsPageLength,
    } = this.props

    const start = optionsPageIndex * optionsPageLength
    const end = start + optionsPageLength

    const Options = FaceData.options.slice(start, end).map((option, index) => (
      <Option
        active={faceOption === start + index}
        key={option.key}
        handleClick={() =>
          this.handleOption(index + optionsPageIndex * optionsPageLength)
        }
      >
        {/* prettier-ignore */}
        <path d="
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
        <path d={option.nose} />
        <path d={option.mouth} />
        <path d={option.eyebrowLeft} />
        <path d={option.eyebrowRight} />
        <circle cx="187.4" cy="248.2" r="15" />
        <circle cx="312.4" cy="248.2" r="15" />
      </Option>
    ))

    return (
      <div>
        <OptionPicker>{Options}</OptionPicker>
        <Pagination
          handlePrev={this.props.handlePrevOptions}
          handleNext={this.props.handleNextOptions}
          listIndex={optionsPageIndex}
          listLength={optionsPageLength}
          totalLength={FaceData.options.length}
        />
        <ColorPicker
          activeColor={faceColor}
          colorsPageIndex={this.props.colorsPageIndex}
          colorsPageLength={this.props.colorsPageLength}
          data={FaceData.colors}
          handleColor={this.handleColor}
        />
        <Pagination
          handlePrev={this.props.handlePrevColors}
          handleNext={this.props.handleNextColors}
          listIndex={colorsPageIndex}
          listLength={colorsPageLength}
          totalLength={FaceData.colors.length}
        />
      </div>
    )
  }
}

AvatarEditFace.propTypes = {
  dispatch: PropTypes.func.isRequired,
  colorsPageIndex: PropTypes.number.isRequired,
  colorsPageLength: PropTypes.number.isRequired,
  handlePrevColors: PropTypes.func.isRequired,
  handleNextColors: PropTypes.func.isRequired,
  handlePrevOptions: PropTypes.func.isRequired,
  handleNextOptions: PropTypes.func.isRequired,
  faceColor: PropTypes.number.isRequired,
  faceOption: PropTypes.number.isRequired,
  optionsPageIndex: PropTypes.number.isRequired,
  optionsPageLength: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  faceColor: state.player.faceColor,
  faceOption: state.player.faceOption,
})

export default AvatarEdit(connect(mapStateToProps)(AvatarEditFace), FaceData)
