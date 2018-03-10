import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Modal } from "components"
import {
  defineMessages,
  injectIntl,
  intlShape,
  FormattedMessage,
} from "react-intl"
import styled from "styled-components"

import {
  checkboxConfig,
  localeConfig,
  pixelRatioConfig,
  shadowConfig,
  volumeConfig,
} from "actions/config"

const messages = defineMessages({
  configTitle: {
    id: "config.title",
    defaultMessage: "Settings",
  },
})

const shadow = defineMessages({
  low: {
    id: "config.shadowquality.low",
    defaultMessage: "Low",
  },
  medium: {
    id: "config.shadowquality.medium",
    defaultMessage: "Medium",
  },
  high: {
    id: "config.shadowquality.high",
    defaultMessage: "High",
  },
  ultra: {
    id: "config.shadowquality.ultra",
    defaultMessage: "Ultra",
  },
})

const List = styled.ul`
  list-style: none;
  margin: 0 0 1em 0;

  & li {
    display: flex;
    align-items: center;
    padding: 0.25em 0;
    border-bottom: 2px solid ${props => props.theme.whitesmoke};
  }

  & li:last-child {
    border-bottom: 0;
  }

  & label {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
`

const Range = styled.input`
  align-self: center;
  background: ${props => props.theme.mercury};
  appearance: none;
  margin: 0;
  cursor: w-resize;
  border-radius: 0;
  height: 1.5em;
  z-index: 0;

  &::-webkit-slider-thumb {
    background: ${props => props.theme.orange};
    border-radius: 0;
    border: 0;
    appearance: none;
    width: 1em;
    height: 1.5em;
  }

  &::-moz-range-thumb {
    background: ${props => props.theme.orange};
    border-radius: 0;
    border: 0;
    appearance: none;
    width: 1em;
    height: 1.5em;
  }

  &::-moz-range-track {
    background: none;
  }

  &::-ms-thumb {
    background: ${props => props.theme.orange};
    border-radius: 0;
  }

  &:focus {
    outline: 2px solid ${props => props.theme.mercury};
    outline-offset: 0;
    border-radius: 3px;
  }
`

const Select = styled.select`
  border: 3px solid ${props => props.theme.orange};
  padding: 0 0.25em;
  outline: 0;
  font: inherit;
  cursor: pointer;
  border-radius: 3px;
  background: none;

  &:focus {
    outline: 2px solid ${props => props.theme.mercury};
    outline-offset: 0;
    border-radius: 3px;
  }
`

const Checkbox = styled.input`
  position: relative;
  width: 1.5em;
  height: 1.5em;
  background: 0;
  font: inherit;
  margin: 0;
  border: 3px solid ${props => props.theme.orange};
  box-sizing: border-box;
  border-radius: 3px;
  appearance: none;
  cursor: pointer;

  &:checked::after {
    content: url('data:image/svg+xml;utf8,
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path
          d="M77.5 21l17 17L64 68 46.7 85.7 29.3 68.4 9.6 48.7l17-17 20 20 31-30.8z"
          fill="${props => props.theme.orange}"/>
      </svg>'
    )
  }

  &:focus {
    outline: 2px solid ${props => props.theme.mercury};
    outline-offset: 0;
    border-radius: 3px;
  }
`

class ModalConfig extends Component {
  constructor() {
    super()

    this.handleLocale = this.handleLocale.bind(this)
    this.handleVolume = this.handleVolume.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.handlePixelRatio = this.handlePixelRatio.bind(this)
    this.handleShadowQuality = this.handleShadowQuality.bind(this)
  }

  handleVolume(event) {
    this.props.dispatch(volumeConfig(parseFloat(event.target.value)))
  }

  handleLocale(event) {
    this.props.dispatch(localeConfig(event.target.value))
  }

  handleCheckbox(event) {
    this.props.dispatch(checkboxConfig(event.target.name, event.target.checked))
  }

  handlePixelRatio(event) {
    this.props.dispatch(pixelRatioConfig(parseFloat(event.target.value, 10)))
  }

  handleShadowQuality(event) {
    this.props.dispatch(shadowConfig(parseInt(event.target.value, 10)))
  }

  render() {
    const { isOpen, handleHide } = this.props
    const { formatMessage } = this.props.intl

    console.log(this.props)

    return (
      <Modal
        isOpen={isOpen}
        heading={formatMessage(messages.configTitle)}
        handleHide={handleHide}
      >
        <h3>
          <FormattedMessage id="config.general" defaultMessage="General" />
        </h3>
        <List>
          <li>
            <label htmlFor="volume">
              <FormattedMessage id="config.volume" defaultMessage="Volume" />
              <Range
                id="volume"
                min="0"
                max="1"
                onChange={this.handleVolume}
                step="0.1"
                type="range"
                value={this.props.volume}
              />
            </label>
          </li>
          <li>
            <label htmlFor="locale">
              <FormattedMessage
                id="config.language"
                defaultMessage="Language"
              />
              <Select
                id="locale"
                name="locale"
                onChange={this.handleLocale}
                value={this.props.locale}
              >
                <option value="en">English</option>
                <option value="hr">Hrvatski</option>
                <option value="nl">Nederlands</option>
                <option value="pt">Português</option>
              </Select>
            </label>
          </li>
        </List>
        <h3>
          <FormattedMessage id="config.video" defaultMessage="Video" />
        </h3>
        <List>
          <li>
            <label htmlFor="pixelRatio">
              <FormattedMessage
                id="config.pixelRatio"
                defaultMessage="Pixel ratio"
              />
              <Range
                id="pixelRatio"
                min="0"
                max="2"
                onChange={this.handlePixelRatio}
                step="0.25"
                type="range"
                value={this.props.pixelRatio}
              />
            </label>
          </li>
          <li>
            <label htmlFor="bloom">
              <FormattedMessage id="config.bloom" defaultMessage="Bloom" />
              <Checkbox
                checked={this.props.glow}
                id="bloom"
                name="glow"
                onChange={this.handleCheckbox}
                type="checkbox"
              />
            </label>
          </li>
          <li>
            <label htmlFor="vignette">
              <FormattedMessage
                id="config.vignette"
                defaultMessage="Vignette"
              />
              <Checkbox
                checked={this.props.fade}
                id="vignette"
                name="fade"
                onChange={this.handleCheckbox}
                type="checkbox"
              />
            </label>
          </li>
          <li>
            <label htmlFor="antialiasing">
              <FormattedMessage
                id="config.antialiasing"
                defaultMessage="Anti-aliasing"
              />
              <Checkbox
                checked={this.props.fxaa}
                id="antialiasing"
                name="fxaa"
                onChange={this.handleCheckbox}
                type="checkbox"
              />
            </label>
          </li>
          <li>
            <label htmlFor="ambientocclusion">
              <FormattedMessage
                id="config.ambientocclusion"
                defaultMessage="Ambient occlusion"
              />
              <Checkbox
                checked={this.props.ssao}
                id="ambientocclusion"
                name="ssao"
                onChange={this.handleCheckbox}
                type="checkbox"
              />
            </label>
          </li>
          <li>
            <label htmlFor="shadowquality">
              <FormattedMessage
                id="config.shadowquality"
                defaultMessage="Shadow quality"
              />
              <Select
                id="shadowquality"
                name="shadowquality"
                onChange={this.handleShadowQuality}
                value={this.props.shadowquality}
              >
                <option value={512}>{formatMessage(shadow.low)}</option>
                <option value={1024}>{formatMessage(shadow.medium)}</option>
                <option value={2048}>{formatMessage(shadow.high)}</option>
                <option value={4096}>{formatMessage(shadow.ultra)}</option>
              </Select>
            </label>
          </li>
        </List>
      </Modal>
    )
  }
}

ModalConfig.propTypes = {
  dispatch: PropTypes.func.isRequired,
  handleHide: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
  // General settings
  volume: PropTypes.number.isRequired,
  locale: PropTypes.string.isRequired,
  // Video settings
  fade: PropTypes.bool.isRequired,
  fxaa: PropTypes.bool.isRequired,
  glow: PropTypes.bool.isRequired,
  ssao: PropTypes.bool.isRequired,
  pixelRatio: PropTypes.number.isRequired,
  shadowquality: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  // General settings
  volume: state.config.volume,
  locale: state.config.locale,
  // Video settings
  fade: state.config.fade,
  fxaa: state.config.fxaa,
  glow: state.config.glow,
  ssao: state.config.ssao,
  pixelRatio: state.config.pixelRatio,
  shadowquality: state.config.shadowquality,
})

export default injectIntl(connect(mapStateToProps)(ModalConfig))
