import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"

class Game extends Component {
  handleLogout() {
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
      </div>
    )
  }
}

Game.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

export default connect()(Game)
