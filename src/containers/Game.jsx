import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { withTheme } from "styled-components"

import { Loader } from "components"

class Game extends Component {
  handleLogout() {
    console.log(this.props)
    this.props.dispatch({ type: "LOGOUT_REQUEST" })
  }

  render() {
    return (
      <div>
        <h2>Game</h2>
        Hello, this is the game page!
        <input
          type="button"
          onClick={() => this.handleLogout()}
          value="Logout"
        />
        <div style={{ backgroundColor: "#ccc" }}>
          <Loader size={50} speed={2} color={this.props.theme.orange} />
        </div>
      </div>
    )
  }
}

Game.propTypes = {
  dispatch: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    orange: PropTypes.string.isRequired,
  }).isRequired,
}

export default connect()(withTheme(Game))
