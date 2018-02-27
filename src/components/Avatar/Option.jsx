import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const Wrap = styled.div`
  width: 100%;
  box-sizing: border-box;
  border-radius: 5%;
  border: 3px solid
    ${props => (props.active ? props.theme.orange : props.theme.whitesmoke)};
  cursor: pointer;
`

const OptionBox = styled.svg`
  display: block;
  width: 100%;
  filter: saturate(0) contrast(0) brightness(1.5);

  > path {
    mix-blend-mode: normal;
    fill: none;
    stroke: ${props => props.theme.silver};
    stroke-width: 20;
    stroke-linecap: round;
  }

  > circle {
    fill: ${props => props.theme.silver};
    stroke: ${props => props.theme.silver};
  }

  > rect {
    mix-blend-mode: normal;
    fill: ${props => props.theme.silver};
  }
`

const Option = ({ active, children, handleClick }) => (
  <Wrap active={active} onClick={handleClick}>
    <OptionBox viewBox="0 0 500 500">{children}</OptionBox>
  </Wrap>
)

Option.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  handleClick: PropTypes.func.isRequired,
}

export default Option
