import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import React3 from "react-three-renderer"

import { World } from "containers/Renderer/Meshes"

// eslint-disable-next-line
if (CLIENT) require("three/examples/js/loaders/GLTFLoader")

const home = require("static/models/home.glb")

class Renderer extends Component {
  constructor() {
    super()

    this.state = {
      pivotRotation: new THREE.Euler(),
    }

    this.origin = new THREE.Vector3(0, 0, 0)
    this.cameraPosition = new THREE.Vector3(0, 200, 500)
  }

  componentDidMount() {
    this.composer()
    const loader = new THREE.GLTFLoader()
    loader.load(
      home,
      data => {
        const model = data.scene

        let i = 0
        model.traverse(node => {
          if (node.isMesh) {
            // node.material = mats[i++]
            node.geometry.computeVertexNormals()
          }
        })

        model.scale.x = 0.1
        model.scale.y = 0.1
        model.scale.z = 0.1

        // this.scene.add(model)
      },
      xhr => {
        console.log(`${xhr.loaded / xhr.total * 100}% loaded`)
      },
      err => {
        console.log("Err:", err)
      },
    )
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.raf)
  }

  composer() {
    this.setState({
      pivotRotation: new THREE.Euler(0, this.state.pivotRotation.y + 0.01, 0),
    })

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
            rotation={this.state.pivotRotation}
            ref={c => {
              this.cameraPivot = c
            }}
          >
            <perspectiveCamera
              name="camera"
              fov={75}
              aspect={winWidth / winHeight}
              near={0.1}
              far={1000}
              lookAt={this.origin}
              position={this.cameraPosition}
              ref={c => {
                this.camera = c
              }}
            />
          </object3D>
          <ambientLight intensity={1} />
          <World
            width={500}
            height={500}
            depth={500}
            widthSegments={28}
            heightSegments={1}
            depthSegments={28}
          />
        </scene>
      </React3>
    )
  }
}

Renderer.propTypes = {
  winWidth: PropTypes.number.isRequired,
  winHeight: PropTypes.number.isRequired,
  pixelRatio: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  winWidth: state.window.width,
  winHeight: state.window.height,
  pixelRatio: state.window.pixelRatio,
})

export default connect(mapStateToProps)(Renderer)
