import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Euler, Vector3 } from "three"
import React3 from "react-three-renderer"

class Renderer extends Component {
  constructor() {
    super()

    this.state = {
      cubeRotation: new Euler(),
    }

    this.cameraPosition = new Vector3(0, 0, 5)

    this.onAnimate = () => {
      this.setState({
        cubeRotation: new Euler(
          this.state.cubeRotation.x + 0.1,
          this.state.cubeRotation.y + 0.1,
          0,
        ),
      })
    }
  }

  render() {
    const { winWidth, winHeight } = this.props

    const styles = {
      display: "block",
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }

    return (
      <React3
        canvasStyle={styles}
        mainCamera="camera"
        width={winWidth}
        height={winHeight}
        onAnimate={this.onAnimate}
      >
        <scene>
          <perspectiveCamera
            name="camera"
            fov={75}
            aspect={winWidth / winHeight}
            near={0.1}
            far={1000}
            position={this.cameraPosition}
          />
          <mesh rotation={this.state.cubeRotation}>
            <boxGeometry width={1} height={1} depth={1} />
            <meshBasicMaterial color={0x00ff00} />
          </mesh>
        </scene>
      </React3>
    )
  }
}

Renderer.propTypes = {
  winWidth: PropTypes.number.isRequired,
  winHeight: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  winWidth: state.window.width,
  winHeight: state.window.height,
})

export default connect(mapStateToProps)(Renderer)
