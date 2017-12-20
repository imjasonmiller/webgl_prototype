import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const Button = styled.a`
  display: inline-block;
  border: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`

const Image = styled.img`
  position: relative;
  width: 30px;
  height: 30px;
  padding: 1em;
  cursor: pointer;
`

const ButtonStats = ({ onClick, alt, src }) => (
  <Button role="button" onClick={onClick}>
    <Image alt={alt} draggable={false} src={src} />
  </Button>
)

ButtonStats.propTypes = {
  onClick: PropTypes.func.isRequired,
  alt: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
}

export default ButtonStats
