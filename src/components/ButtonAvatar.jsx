import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

import {
  AvatarViewFace,
  AvatarViewHair,
  AvatarViewItem,
  AvatarViewWear,
} from "containers"

const Button = styled.div`
  position: relative;
  width: 30%;
  height: 100%;
  overflow: hidden;
  border-radius: 50%;
  filter: drop-shadow(rgba(0, 0, 0, 0.25) 0px 0px 5px);
  cursor: pointer;
`

const ButtonAvatar = ({ onClick }) => (
  <Button onClick={onClick}>
    <AvatarViewFace />
    <AvatarViewHair />
    <AvatarViewItem />
    <AvatarViewWear />
  </Button>
)

ButtonAvatar.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default ButtonAvatar
