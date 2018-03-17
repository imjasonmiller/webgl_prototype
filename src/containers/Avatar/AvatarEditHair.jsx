import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { ColorPicker, OptionPicker, Pagination } from "containers"
import { changeAvatarHairColor, changeAvatarHairOption } from "actions/player"

import Option from "components/Avatar/Option"

import HairData from "static/avatar/hair"

import AvatarEdit from "./AvatarEdit"

class AvatarEditHair extends Component {
  constructor() {
    super()

    this.handleColor = this.handleColor.bind(this)
  }

  handleColor(color) {
    this.props.dispatch(changeAvatarHairColor(color))
  }

  handleOption(option) {
    this.props.dispatch(changeAvatarHairOption(option))
  }

  render() {
    const {
      colorsPageIndex,
      colorsPageLength,
      hairColor,
      hairOption,
      optionsPageIndex,
      optionsPageLength,
    } = this.props

    const start = optionsPageIndex * optionsPageLength
    const end = start + optionsPageLength

    const Options = HairData.options.slice(start, end).map((option, index) => (
      <Option
        active={hairOption === start + index}
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
        <path d="M232,296.5c10,9.9,26,9.9,36-0.1" />
        <path d="M213.8,341L213.8,341c20,20,52.4,20,72.4,0" />
        <path d="M212.4,204.5c-13.8-13.8-36.1-13.8-49.9,0" />
        <path d="M287.6,204.5c13.8-13.8,36.1-13.8,49.9,0" />
        <circle cx="187.4" cy="248.2" r="15" />
        <circle cx="312.4" cy="248.2" r="15" />
        {HairData.options[index + optionsPageIndex * optionsPageLength].data(
          "rgb(187, 187, 187)",
        )}
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
          totalLength={HairData.options.length}
        />
        <ColorPicker
          activeColor={hairColor}
          colorsPageIndex={this.props.colorsPageIndex}
          colorsPageLength={this.props.colorsPageLength}
          data={HairData.colors}
          handleColor={this.handleColor}
        />
        <Pagination
          handlePrev={this.props.handlePrevColors}
          handleNext={this.props.handleNextColors}
          listIndex={colorsPageIndex}
          listLength={colorsPageLength}
          totalLength={HairData.colors.length}
        />
      </div>
    )
  }
}

AvatarEditHair.propTypes = {
  dispatch: PropTypes.func.isRequired,
  colorsPageIndex: PropTypes.number.isRequired,
  colorsPageLength: PropTypes.number.isRequired,
  handlePrevColors: PropTypes.func.isRequired,
  handleNextColors: PropTypes.func.isRequired,
  handlePrevOptions: PropTypes.func.isRequired,
  handleNextOptions: PropTypes.func.isRequired,
  hairColor: PropTypes.number.isRequired,
  hairOption: PropTypes.number.isRequired,
  optionsPageIndex: PropTypes.number.isRequired,
  optionsPageLength: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  hairColor: state.player.hairColor,
  hairOption: state.player.hairOption,
})

export default AvatarEdit(connect(mapStateToProps)(AvatarEditHair), HairData)
