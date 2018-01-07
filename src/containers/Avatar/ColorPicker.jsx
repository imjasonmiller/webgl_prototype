import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const ColorWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 1em;
  grid-auto-rows: min-content;
`

const ColorPicker = props => <ColorWrap>{props.children}</ColorWrap>

ColorPicker.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ColorPicker
