import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Modal } from "components"
import styled from "styled-components"

import { AvatarViewFace, AvatarEditFace } from "containers"

const Sticky = styled.div`
  will-change: transform;
  transform: ${props =>
    `translateY(calc(${props.modalScroll + props.modalHeight / 2}px - 50%))`};
  transition: transform 0.5s ease;
`
const ModalAvatar = ({ handleHide, isOpen, modalHeight, modalScroll }) => (
  <Modal isOpen={isOpen} heading="Avatar" handleHide={handleHide}>
    <Sticky modalHeight={modalHeight} modalScroll={modalScroll}>
      <AvatarViewFace />
    </Sticky>
    <AvatarEditFace />
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
