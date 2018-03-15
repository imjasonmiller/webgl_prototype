import React, { Component } from "react"
import PropTypes from "prop-types"

class Arrow extends Component {
  componentDidMount() {
    // Center arrow
    this.arrow.geometry.center()
  }

  componentWillUnmount() {
    this.arrow.geometry.dispose()
    this.arrow.material.dispose()
    this.arrow = undefined
  }

  render() {
    const {
      headWidth,
      headHeight,
      tailWidth,
      tailHeight,
      time,
      tool,
    } = this.props

    const rotationX = tool === "RAISE" ? 0 : 3.14

    this.props.position.y += headHeight + tailHeight

    return (
      <mesh
        position={this.props.position}
        rotation={new THREE.Euler(rotationX, time / 6.28, 0)}
        ref={c => {
          this.arrow = c
        }}
        visible={this.props.tool === "RAISE" || this.props.tool === "LOWER"}
      >
        <extrudeGeometry
          amount={1}
          bevelThickness={1}
          bevelSize={0.25}
          bevelSegments={6}
        >
          <shape>
            <moveTo x={0} y={0} />
            <lineTo x={tailWidth / 2} y={0} />
            <lineTo x={tailWidth / 2} y={tailHeight} />
            <lineTo x={headWidth / 2} y={tailHeight} />
            <lineTo x={0} y={tailHeight + headHeight} />
            <lineTo x={-headWidth / 2} y={tailHeight} />
            <lineTo x={-tailWidth / 2} y={tailHeight} />
            <lineTo x={-tailWidth / 2} y={0} />
            <lineTo x={0} y={0} />
          </shape>
        </extrudeGeometry>
        <meshBasicMaterial color={0xff8800} />
      </mesh>
    )
  }
}

Arrow.defaultProps = {
  headWidth: 16,
  headHeight: 12,
  tailWidth: 8,
  tailHeight: 12,
}

Arrow.propTypes = {
  headWidth: PropTypes.number,
  headHeight: PropTypes.number,
  position: PropTypes.instanceOf(THREE.Vector3).isRequired,
  tailWidth: PropTypes.number,
  tailHeight: PropTypes.number,
  tool: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
}

export default Arrow
