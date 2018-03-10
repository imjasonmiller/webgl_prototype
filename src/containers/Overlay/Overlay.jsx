import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { injectIntl } from "react-intl"
import styled from "styled-components"
import media from "style-utils/media"

import { ButtonAvatar, ButtonStats, ButtonTool } from "components"

import { Compass, ModalAvatar, ModalConfig } from "containers"

import { rotateCamera } from "actions/player"

const iconConfig = require("static/images/icon_config.svg")
const iconLogout = require("static/images/icon_logout.svg")

const iconSelect = require("static/images/tool_select.svg")
const iconCreate = require("static/images/tool_create.svg")
const iconLower = require("static/images/tool_lower.svg")
const iconRaise = require("static/images/tool_raise.svg")

const Stats = styled.div`
  position: absolute;
  width: 250px;
  height: 150px;
`

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 300px;
  height: 105px;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  ${media.lg`
    width: 500px;
    height: 150px;
  `};
`

class Overlay extends Component {
  constructor() {
    super()
    this.state = {
      modalAvatar: false,
      modalConfig: false,
    }
  }

  handleShowConfig() {
    this.setState({ modalConfig: true })
  }

  handleHideConfig() {
    this.setState({ modalConfig: false })
  }

  handleShowAvatar() {
    this.setState({ modalAvatar: true })
  }

  handleHideAvatar() {
    this.setState({ modalAvatar: false })
  }

  handleCameraRotation() {
    this.props.dispatch(rotateCamera())
  }
  handleLogout() {
    this.props.dispatch({ type: "LOGOUT_REQUEST" })
  }

  render() {
    return (
      <div>
        <Stats>
          <ButtonStats
            alt="Config"
            src={iconConfig}
            onClick={() => this.handleShowConfig()}
          />
          <ModalConfig
            isOpen={this.state.modalConfig}
            handleHide={() => this.handleHideConfig()}
          />
          <ButtonStats
            alt="Logout"
            src={iconLogout}
            onClick={() => this.handleLogout()}
          />
        </Stats>
        <Compass
          cameraRotation={this.props.cameraRotation}
          handleCameraRotation={() => this.handleCameraRotation()}
        />
        <Controls>
          <ButtonTool alt="Select construct" src={iconSelect} />
          <ButtonTool alt="Create construct" src={iconCreate} />
          <ButtonAvatar onClick={() => this.handleShowAvatar()} />
          <ModalAvatar
            isOpen={this.state.modalAvatar}
            handleHide={() => this.handleHideAvatar()}
          />
          <ButtonTool alt="Lower terrain" src={iconLower} />
          <ButtonTool alt="Raise terrain" src={iconRaise} />
        </Controls>
      </div>
    )
  }
}

Overlay.propTypes = {
  cameraRotation: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  serverTime: state.player.serverTime,
  cameraRotation: state.player.cameraRotation,
})

export default injectIntl(connect(mapStateToProps)(Overlay))
