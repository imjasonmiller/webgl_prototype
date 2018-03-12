import React, { Component } from "react"
import PropTypes from "prop-types"

import { Loader } from "containers"

class Skybox extends Component {
  constructor() {
    super()
    this.vertShader = Loader.getFile("skybox_vert")
    this.fragShader = Loader.getFile("skybox_frag")
  }

  render() {
    return (
      <mesh
        ref={c => {
          this.obj = c
        }}
      >
        <boxGeometry
          width={this.props.size}
          height={this.props.size}
          depth={this.props.size}
        />
        <shaderMaterial
          vertexShader={this.vertShader}
          fragmentShader={this.fragShader}
          side={THREE.BackSide}
        >
          <uniforms>
            <uniform type="f" name="time" value={this.props.time.delta} />
          </uniforms>
        </shaderMaterial>
      </mesh>
    )
  }
}

Skybox.defaultProps = {
  size: 2000,
}

Skybox.propTypes = {
  size: PropTypes.number,
  time: PropTypes.shape({
    delta: PropTypes.number,
    min: PropTypes.number,
    sec: PropTypes.number,
    ms: PropTypes.number,
  }).isRequired,
}

export default Skybox
