import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import media from "style-utils/media"

const Button = styled.a`
  display: block;
  position: relative;
  width: 17.5%;
  padding: 0.25em;
  ${media.lg`
    padding: 0.5em;
  `};
  border: 0;
  filter: drop-shadow(rgba(0, 0, 0, 0.25) 0px 0px 5px);
  user-select: none;
  text-decoration: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  &::before {
    display: block;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: ${props => props.theme.orange};
    border-radius: 50%;
    transform: scale(${props => (props.active ? 0.95 : 0.5)});
    transition: transform 0.15s ease-in-out;
  }
`

const Image = styled.img`
  display: block;
  position: relative;
  width: 100%;
  cursor: pointer;
`

const ButtonTool = ({ active, alt, src, onMouseDown, onTouchStart }) => (
  <Button
    active={active}
    role="button"
    onMouseDown={onMouseDown}
    onTouchStart={onTouchStart}
  >
    <Image alt={alt} draggable={false} src={src} />
  </Button>
)

ButtonTool.propTypes = {
  active: PropTypes.bool.isRequired,
  alt: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onTouchStart: PropTypes.func.isRequired,
}

export default ButtonTool
