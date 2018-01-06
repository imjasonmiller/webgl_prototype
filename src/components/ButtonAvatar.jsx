import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

import AvatarViewFace from "containers/Avatar/AvatarViewFace"

const Button = styled.div`
  position: relative;
  width: 30%;
  height: 100%;
  border-radius: 50%;
  filter: drop-shadow(rgba(0, 0, 0, 0.25) 0px 0px 5px);
  cursor: pointer;
`

const ButtonAvatar = ({ onClick }) => (
  <Button onClick={onClick}>
    <AvatarViewFace />
  </Button>
)

ButtonAvatar.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default ButtonAvatar
