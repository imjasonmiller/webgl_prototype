import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import React3 from "react-three-renderer"
import Animated from "animated/lib/targets/react-dom"

import { Time } from "containers"

import { CelestialBody, Skybox, Terrain } from "containers/Renderer/Meshes"

class Renderer extends Component {
  constructor() {
    super()

    this.state = {
      timeNow: Date.now(),
      // timeDelta: Date.now(),
    }

    this.gameTime = new THREE.Clock()

    this.origin = new THREE.Vector3(0, 0, 0)

    this.cameraPosition = new THREE.Vector3(0, 200, 500)

    this.cameraPivotRotation = new Animated.Value(0)
    this.cameraPivotRotation
      .interpolate({
        inputRange: [0, 360],
        outputRange: [0, 6.2831],
      })
      .addListener(({ value }) => {
        this.cameraPivot.rotation.y = value
      })
  }

  componentDidMount() {
    this.composer()
  }

  componentWillReceiveProps(nextProps) {
    const { cameraRotation } = nextProps

    if (this.props.cameraRotation !== cameraRotation) {
      Animated.spring(this.cameraPivotRotation, {
        toValue: cameraRotation,
        tension: 150,
        friction: 100,
      }).start()
    }
  }

  componentWillUnmount() {
    this.cameraPivotRotation.removeAllListeners()
    window.cancelAnimationFrame(this.raf)
  }

  composer() {
    this.setState({
      timeNow: Date.now(),
      // timeDelta: Date.now() - this.state.timeNow,
      // pivotRotation: new THREE.Euler(0, this.state.pivotRotation.y + 0.01, 0),
    })

    // console.log(this.state.timeNow, this.state.timeDelta)

    this.webGLRenderer.render(this.scene, this.camera)

    this.raf = window.requestAnimationFrame(() => this.composer())
  }

  render() {
    const { winWidth, winHeight, pixelRatio } = this.props

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
        onRendererUpdated={c => {
          this.webGLRenderer = c
        }}
        gammaOutput
        forceManualRender
        pixelRatio={pixelRatio}
        onAnimate={this.onAnimate}
      >
        <scene
          ref={c => {
            this.scene = c
          }}
        >
          <object3D
            ref={c => {
              this.cameraPivot = c
            }}
          >
            <perspectiveCamera
              name="camera"
              fov={75}
              aspect={winWidth / winHeight}
              near={10}
              far={2000}
              lookAt={this.origin}
              position={this.cameraPosition}
              ref={c => {
                this.camera = c
              }}
            />
          </object3D>

          <ambientLight intensity={1} />

          <Terrain
            width={500}
            height={500}
            depth={500}
            widthSegments={28}
            heightSegments={1}
            depthSegments={28}
            vertices={this.props.terrainVerts}
          />

          <Skybox time={Time.getTime()} />

          <group
            rotation={
              new THREE.Euler(
                // Altitude, highest angle being 30 degrees
                Math.PI / 6,
                // Rotational speed, every 15000 ms = 1 rotation
                Math.PI * 2 * ((this.state.timeNow % 15000) / 15000),
                0,
              )
            }
          >
            <CelestialBody
              name="sun"
              color={new THREE.Color(0xe68c21)}
              position={new THREE.Vector3(0, 0, 750)}
              time={this.state.timeNow}
            />

            <CelestialBody
              name="moon"
              color={new THREE.Color(0xbfbfbf)}
              position={new THREE.Vector3(0, 0, -750)}
              time={this.state.timeNow}
            />
          </group>
        </scene>
      </React3>
    )
  }
}

/**
 * All props are passed down to their components here due to a bug
 * @see https://github.com/toxicFork/react-three-renderer/issues/140
 */
Renderer.propTypes = {
  // player
  cameraRotation: PropTypes.number.isRequired,
  terrainVerts: PropTypes.arrayOf(PropTypes.number).isRequired,
  // window
  winWidth: PropTypes.number.isRequired,
  winHeight: PropTypes.number.isRequired,
  pixelRatio: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  // player
  cameraRotation: state.player.cameraRotation,
  terrainVerts: state.player.terrain,
  // window
  winWidth: state.window.width,
  winHeight: state.window.height,
  pixelRatio: state.window.pixelRatio,
})

export default connect(mapStateToProps)(Renderer)
