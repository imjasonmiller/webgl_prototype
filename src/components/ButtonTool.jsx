import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
// import media from "style-utils/media"

const Button = styled.a`
  display: block;
  position: relative;
  width: 17.5%;
  padding: 0.25em;
  border: 0;
  filter: drop-shadow(rgba(0, 0, 0, 0.25) 0px 0px 5px);
  user-select: none;
  text-decoration: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`

const Image = styled.img`
  position: relative;
  width: 100%;
  cursor: pointer;
`

const ButtonTool = ({ alt, src }) => (
  <Button role="button">
    <Image alt={alt} draggable={false} src={src} />
  </Button>
)

ButtonTool.propTypes = {
  alt: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
}

export default ButtonTool
