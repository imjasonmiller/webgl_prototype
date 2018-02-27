import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const Wrap = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 1em;
  grid-auto-rows: min-content;
  margin: 0 0 1em 0;
`

const Color = styled.svg`
  display: block;
  width: 100%;
  box-sizing: border-box;
  border: 3px solid
    ${props => (props.active ? props.theme.orange : props.theme.whitesmoke)};
  border-radius: 50%;
  cursor: pointer;
`

const ColorPicker = ({
  activeColor,
  colorsPageIndex,
  colorsPageLength,
  data,
  handleColor,
}) => {
  const start = colorsPageIndex * colorsPageLength
  const end = start + colorsPageLength

  const Colors = data.slice(start, end).map((color, index) => (
    <Color
      active={activeColor === start + index}
      key={color}
      onClick={() => handleColor(start + index)}
      viewBox="0 0 10 10"
    >
      <circle cx="5" cy="5" r="4.5" fill={color} />
    </Color>
  ))

  return <Wrap>{Colors}</Wrap>
}

ColorPicker.propTypes = {
  activeColor: PropTypes.number.isRequired,
  colorsPageIndex: PropTypes.number.isRequired,
  colorsPageLength: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleColor: PropTypes.func.isRequired,
}

export default ColorPicker
