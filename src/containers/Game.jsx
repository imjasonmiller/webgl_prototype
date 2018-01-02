import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import styled, { withTheme } from "styled-components"
import { Loader, Overlay, Renderer } from "containers"

import { Spinner } from "components"

import { modifyTerrain } from "actions/player"

const WrapOverflow = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
`

class Game extends Component {
  constructor() {
    super()
    this.state = {
      loaded: false,
      progress: 0,
    }
  }

  componentDidMount() {
    Loader.load(progress => this.setState({ progress })).then(() =>
      this.loadPlayer(),
    )
    // .catch((err) => console.log(err))
  }

  loadPlayer() {
    // Map cookie string to object
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const key = cookie.split("=")[0]
      const val = cookie.split("=")[1]

      // Append computed key and val to accumulator
      return Object.assign(acc, { [key]: val })
    }, {})

    return fetch(`${APP_HTTPS}://${APP_HOST}:${APP_PORT}/api/player/me`, {
      method: "GET",
      credentials: "same-origin",
      headers: new Headers({
        xsrf: cookies.xsrf || "",
      }),
    })
      .then(res => res.json())
      .then(data => {
        // Dispatch
        this.props.dispatch(modifyTerrain(data.terrain))
        this.setState({ loaded: true })
      })
    // .catch(err => this.props.dispatch(showToast(
    //   "Could not retrieve player data"
    // )))
  }

  render() {
    return (
      <div>
        <WrapOverflow>
          {this.state.loaded ? (
            <Renderer />
          ) : (
            <div>
              {this.state.progress}
              <Spinner size={50} speed={2} color={this.props.theme.orange} />
            </div>
          )}
          <Overlay />
        </WrapOverflow>
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
