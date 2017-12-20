import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { withTheme } from "styled-components"

import { Loader } from "components"
import { Overlay, Renderer } from "containers"

const Game = ({ theme }) => (
  <div>
    <div>
      {/* <Loader size={50} speed={2} color={theme.orange} /> */}
      <Renderer />
      <Overlay />
    </div>
  </div>
)

Game.propTypes = {
  theme: PropTypes.shape({
    orange: PropTypes.string.isRequired,
  }).isRequired,
}

export default withTheme(Game)
