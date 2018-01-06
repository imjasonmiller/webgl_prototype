import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const OptionWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1em;
  grid-auto-rows: min-content;
`

const OptionPicker = props => <OptionWrap>{props.children}</OptionWrap>

OptionPicker.propTypes = {
  children: PropTypes.node.isRequired,
}

export default OptionPicker
