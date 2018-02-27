import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const Wrap = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1em;
  grid-auto-rows: min-content;
  margin: 0 0 1em 0;
`

const OptionPicker = props => <Wrap>{props.children}</Wrap>

OptionPicker.propTypes = {
  children: PropTypes.node.isRequired,
}

export default OptionPicker
