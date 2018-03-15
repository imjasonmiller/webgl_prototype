import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Modal, ConstructIcon } from "components"
// import styled from "styled-components"

import { selectConstruct } from "actions/player"

const iconHome = require("static/images/icon_home.png")
const iconTree = require("static/images/icon_tree.png")
const iconWindturbine = require("static/images/icon_windturbine.png")

class ModalCreate extends Component {
  selectConstruct(object) {
    const { dispatch, handleHide } = this.props

    dispatch(selectConstruct(object))
    handleHide()
  }

  render() {
    const { isOpen, handleHide } = this.props

    return (
      <Modal isOpen={isOpen} heading="Create" handleHide={handleHide}>
        <ConstructIcon
          onClick={() => this.selectConstruct("HOME")}
          energyAmount={25}
          energyTarget={50}
          imageSrc={iconHome}
        />
        <ConstructIcon
          onClick={() => this.selectConstruct("TREE")}
          energyAmount={25}
          energyTarget={25}
          imageSrc={iconTree}
        />
        <ConstructIcon
          onClick={() => this.selectConstruct("WINDTURBINE")}
          energyAmount={25}
          energyTarget={75}
          imageSrc={iconWindturbine}
        />
      </Modal>
    )
  }
}

ModalCreate.propTypes = {
  dispatch: PropTypes.func.isRequired,
  handleHide: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

const mapStateToProps = () => ({})

export default connect(mapStateToProps)(ModalCreate)
