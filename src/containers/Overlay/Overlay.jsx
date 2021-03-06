import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { injectIntl } from "react-intl"
import styled from "styled-components"
import media from "style-utils/media"

import { ButtonAvatar, ButtonStats, ButtonTool } from "components"

import { Compass, ModalAvatar, ModalConfig, ModalCreate } from "containers"

import { changeTool, rotateCamera } from "actions/player"

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
  transform: translateY(${props => (props.loadComplete ? `0` : `100%`)});
  transition: transform 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
`

class Overlay extends Component {
  constructor() {
    super()
    this.state = {
      modalAvatar: false,
      modalConfig: false,
      modalCreate: false,
    }
  }

  handleShowConfig() {
    this.setState({ modalConfig: true })
  }

  handleHideConfig() {
    this.setState({ modalConfig: false })
  }

  handleShowCreate() {
    this.setState({ modalCreate: true })
    this.props.dispatch(changeTool("CREATE"))
  }

  handleHideCreate() {
    this.setState({ modalCreate: false })
    // this.props.dispatch(changeTool("SELECT"))
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
    const { dispatch, tool } = this.props

    return (
      <div>
        <Stats>
          <ButtonStats
            alt="Config"
            src={iconConfig}
            onClick={() => this.handleShowConfig()}
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
        <Controls loadComplete={this.props.loadComplete}>
          <ButtonTool
            active={tool === "SELECT"}
            alt="Select construct"
            src={iconSelect}
            onMouseDown={() => dispatch(changeTool("SELECT"))}
            onTouchStart={() => dispatch(changeTool("SELECT"))}
          />
          <ButtonTool
            active={tool === "CREATE"}
            alt="Create construct"
            src={iconCreate}
            onMouseDown={() => this.handleShowCreate()}
            onTouchStart={() => this.handleShowCreate()}
          />
          <ButtonAvatar onClick={() => this.handleShowAvatar()} />
          <ButtonTool
            active={tool === "LOWER"}
            alt="Lower terrain"
            src={iconLower}
            onMouseDown={() => dispatch(changeTool("LOWER"))}
            onTouchStart={() => dispatch(changeTool("LOWER"))}
          />
          <ButtonTool
            active={tool === "RAISE"}
            alt="Raise terrain"
            src={iconRaise}
            onMouseDown={() => dispatch(changeTool("RAISE"))}
            onTouchStart={() => dispatch(changeTool("RAISE"))}
          />
        </Controls>
        <ModalConfig
          isOpen={this.state.modalConfig}
          handleHide={() => this.handleHideConfig()}
        />
        <ModalCreate
          isOpen={this.state.modalCreate}
          handleHide={() => this.handleHideCreate()}
        />
        <ModalAvatar
          isOpen={this.state.modalAvatar}
          handleHide={() => this.handleHideAvatar()}
        />
      </div>
    )
  }
}

Overlay.propTypes = {
  cameraRotation: PropTypes.number.isRequired,
  loadComplete: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  tool: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  serverTime: state.player.serverTime,
  cameraRotation: state.player.cameraRotation,
  loadComplete: state.player.loadComplete,
  tool: state.player.tool,
})

export default injectIntl(connect(mapStateToProps)(Overlay))
