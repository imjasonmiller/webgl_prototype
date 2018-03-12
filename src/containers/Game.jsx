import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import styled, { withTheme } from "styled-components"
import { Loader, Overlay, Renderer, Time } from "containers"
import { Spinner } from "components"
import { injectIntl } from "react-intl"

import {
  logout,
  modifyTerrain,
  loadProgress,
  loadComplete,
} from "actions/player"

const WrapOverflow = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
`

const LoadWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 50%;
  height: 0;
  padding-bottom: 25%;
`

const LoadText = styled.h2`
  text-align: center;
`

class Game extends Component {
  componentDidMount() {
    Loader.load(progress => this.props.dispatch(loadProgress(progress))).then(
      () => this.loadPlayer(),
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

    // const fetchStart = (performance || Date).now()

    return fetch(`${APP_HTTPS}://${APP_HOST}:${APP_PORT}/api/player/me`, {
      method: "GET",
      credentials: "same-origin",
      headers: new Headers({
        xsrf: cookies.xsrf || "",
      }),
    })
      .then(res => res.json())
      .then(data => {
        // const fetchTime = (performance || Date).now() - fetchStart
        // Time.setTime(data.time + fetchTime)
        this.props.dispatch(modifyTerrain(data.terrain))
        this.props.dispatch(loadComplete())
      })
      .catch(() => {
        this.props.dispatch(logout())
        this.props.history.push("/")
      })
  }

  render() {
    return (
      <div>
        <WrapOverflow>
          {this.props.loadComplete ? (
            <Renderer />
          ) : (
            <LoadWrap>
              <Spinner size={50} speed={2} color={this.props.theme.orange} />
              <LoadText>{`${this.props.loadProgress.toFixed(1)}%`}</LoadText>
            </LoadWrap>
          )}
          <Overlay />
        </WrapOverflow>
      </div>
    )
  }
}

Game.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  theme: PropTypes.shape({
    orange: PropTypes.string.isRequired,
  }).isRequired,
  loadComplete: PropTypes.bool.isRequired,
  loadProgress: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  loadComplete: state.player.loadComplete,
  loadProgress: state.player.loadProgress,
})

export default withRouter(injectIntl(connect(mapStateToProps)(withTheme(Game))))
