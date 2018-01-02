import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import styled from "styled-components"
import media from "style-utils/media"

import { ButtonStats, ButtonTool } from "components"

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
      // modalConfig: false,
    }
  }

  // handleConfig() {
  //   console.log("Config")
  // }

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
            onClick={() => this.handleConfig()}
          />
          <ButtonStats
            alt="Logout"
            src={iconLogout}
            onClick={() => this.handleLogout()}
          />
        </Stats>
        <Controls>
          <ButtonTool alt="Select construct" src={iconSelect} />
          <ButtonTool alt="Create construct" src={iconCreate} />
          <ButtonTool alt="Lower terrain" src={iconLower} />
          <ButtonTool alt="Raise terrain" src={iconRaise} />
        </Controls>
      </div>
    )
  }
}

Overlay.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

export default connect()(Overlay)
