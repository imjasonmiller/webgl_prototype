import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"

import { Home, Tree, Windturbine } from "containers/Renderer/Meshes"

import { createConstruct, selectConstruct } from "actions/player"

const ConstructsPlaced = ({ constructs }) => (
  // React < 16.2.0 requires a wrapping component
  <group>
    {constructs.map(construct => {
      switch (construct.name) {
        case "HOME":
          return (
            <Home
              position={{ x: construct.x, y: construct.y, z: construct.z }}
              key={`HOME_${construct.x}_${construct.z}`}
            />
          )
        case "TREE":
          return (
            <Tree
              position={{ x: construct.x, y: construct.y, z: construct.z }}
              key={`TREE_${construct.x}_${construct.z}`}
            />
          )
        case "WINDTURBINE":
          return (
            <Windturbine
              position={{ x: construct.x, y: construct.y, z: construct.z }}
              key={`WINDTURBINE_${construct.x}_${construct.z}`}
            />
          )
        default:
          return null
      }
    })}
  </group>
)

const Preview = ({ construct, position }) => {
  switch (construct) {
    case "HOME":
      return <Home position={position} preview />
    case "TREE":
      return <Tree position={position} preview />
    case "WINDTURBINE":
      return <Windturbine position={position} preview />
    default:
      return null
  }
}

class Constructs extends Component {
  static roundToNearest(numToRound, numToRoundTo) {
    return Math.round(numToRound * (1 / numToRoundTo)) / (1 / numToRoundTo)
  }

  constructor() {
    super()

    // this.state = {
    //   isMoving: false,
    // }

    // this.handleDown = this.handleDown.bind(this)
    this.handleUp = this.handleUp.bind(this)

    // window.addEventListener("mousedown", this.handleDown)
    // window.addEventListener("touchstart", this.handleDown)

    window.addEventListener("mouseup", this.handleUp)
    window.addEventListener("touchend", this.handleUp)
  }

  componentDidMount() {}

  componentWillUnmount() {
    // window.removeEventListener("mousedown", this.handleDown)
    // window.removeEventListener("touchstart", this.handleDown)

    window.removeEventListener("mouseup", this.handleUp)
    window.removeEventListener("touchend", this.handleUp)
  }

  // handleDown() {}

  handleUp() {
    const { terrainIntersection: { x, y, z }, constructSelected } = this.props

    if (
      constructSelected === "HOME" ||
      constructSelected === "TREE" ||
      constructSelected === "WINDTURBINE"
    ) {
      this.props.dispatch(
        createConstruct({
          x,
          y,
          z,
          name: constructSelected,
          size: 3,
          rotation: 0,
        }),
      )
    }
    this.props.dispatch(selectConstruct("NONE"))
  }

  render() {
    const { constructs, constructSelected, terrainIntersection } = this.props

    const position = {
      x: Constructs.roundToNearest(terrainIntersection.x, 500 / 28),
      y: terrainIntersection.y,
      z: Constructs.roundToNearest(terrainIntersection.z, 500 / 28),
    }

    return (
      <group>
        <Preview construct={constructSelected} position={position} />
        <ConstructsPlaced constructs={constructs} time={this.props.time} />
      </group>
    )
  }
}

ConstructsPlaced.propTypes = {
  constructs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      size: PropTypes.number,
      x: PropTypes.number,
      y: PropTypes.number,
      z: PropTypes.number,
      rotation: PropTypes.number,
    }),
  ).isRequired,
}

Constructs.propTypes = {
  constructs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      size: PropTypes.number,
      x: PropTypes.number,
      y: PropTypes.number,
      z: PropTypes.number,
      rotation: PropTypes.number,
    }),
  ).isRequired,
  constructSelected: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  terrainIntersection: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
  }).isRequired,
  time: PropTypes.objectOf(PropTypes.number).isRequired,
}

const mapStateToProps = state => ({
  constructs: state.player.constructs,
  constructSelected: state.player.constructSelected,
  terrainIntersection: state.player.terrainIntersection,
})

export default connect(mapStateToProps)(Constructs)
