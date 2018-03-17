import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { ColorPicker, OptionPicker, Pagination } from "containers"
import { changeAvatarWearColor, changeAvatarWearOption } from "actions/player"

import Option from "components/Avatar/Option"

import WearData from "static/avatar/wear"

import AvatarEdit from "./AvatarEdit"

class AvatarEditWear extends Component {
  constructor() {
    super()

    this.handleColor = this.handleColor.bind(this)
  }

  handleColor(color) {
    this.props.dispatch(changeAvatarWearColor(color))
  }

  handleOption(option) {
    this.props.dispatch(changeAvatarWearOption(option))
  }

  render() {
    const {
      colorsPageIndex,
      colorsPageLength,
      wearColor,
      wearOption,
      optionsPageIndex,
      optionsPageLength,
    } = this.props

    const start = optionsPageIndex * optionsPageLength
    const end = start + optionsPageLength

    const Options = WearData.options.slice(start, end).map((option, index) => (
      <Option
        active={wearOption === start + index}
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
        {WearData.options[index + optionsPageIndex * optionsPageLength].data(
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
          totalLength={WearData.options.length}
        />
        <ColorPicker
          activeColor={wearColor}
          colorsPageIndex={this.props.colorsPageIndex}
          colorsPageLength={this.props.colorsPageLength}
          data={WearData.colors}
          handleColor={this.handleColor}
        />
        <Pagination
          handlePrev={this.props.handlePrevColors}
          handleNext={this.props.handleNextColors}
          listIndex={colorsPageIndex}
          listLength={colorsPageLength}
          totalLength={WearData.colors.length}
        />
      </div>
    )
  }
}

AvatarEditWear.propTypes = {
  dispatch: PropTypes.func.isRequired,
  colorsPageIndex: PropTypes.number.isRequired,
  colorsPageLength: PropTypes.number.isRequired,
  handlePrevColors: PropTypes.func.isRequired,
  handleNextColors: PropTypes.func.isRequired,
  handlePrevOptions: PropTypes.func.isRequired,
  handleNextOptions: PropTypes.func.isRequired,
  wearColor: PropTypes.number.isRequired,
  wearOption: PropTypes.number.isRequired,
  optionsPageIndex: PropTypes.number.isRequired,
  optionsPageLength: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  wearColor: state.player.wearColor,
  wearOption: state.player.wearOption,
})

export default AvatarEdit(connect(mapStateToProps)(AvatarEditWear), WearData)
