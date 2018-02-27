import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Modal } from "components"
import styled from "styled-components"

import {
  AvatarViewFace,
  AvatarViewHair,
  AvatarViewItem,
  AvatarViewWear,
  AvatarEditFace,
  AvatarEditHair,
  AvatarEditItem,
  AvatarEditWear,
} from "containers"

/**
 * Percentage based padding is based on the container's width.
 * A height of "0" and padding-bottom of "100%" make a square.
 * This prevents the container from overflowing the content area,
 * creating a scrollbar once the user has scrolled all the way down.
 */
const Sticky = styled.div`
  height: 0;
  padding-bottom: 100%;
  will-change: transform;
  transform: ${props =>
    `translateY(calc(${props.modalScroll + props.modalHeight / 2}px - 50%))`};
  transition: transform 0.5s ease;
`
const ModalAvatar = ({ handleHide, isOpen, modalHeight, modalScroll }) => (
  <Modal isOpen={isOpen} heading="Avatar" handleHide={handleHide}>
    <Sticky modalHeight={modalHeight} modalScroll={modalScroll}>
      <AvatarViewFace />
      <AvatarViewHair />
      <AvatarViewItem />
      <AvatarViewWear />
    </Sticky>
    <div>
      <h2>Face</h2>
      <AvatarEditFace />
      <h2>Hair</h2>
      <AvatarEditHair />
      <h2>Item</h2>
      <AvatarEditItem />
      <h2>Wear</h2>
      <AvatarEditWear />
    </div>
  </Modal>
)

ModalAvatar.propTypes = {
  modalHeight: PropTypes.number.isRequired,
  modalScroll: PropTypes.number.isRequired,
  handleHide: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  modalHeight: state.window.modalHeight,
  modalScroll: state.window.modalScroll,
})

export default connect(mapStateToProps)(ModalAvatar)
