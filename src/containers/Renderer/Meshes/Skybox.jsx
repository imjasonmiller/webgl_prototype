import React, { Component } from "react"
import PropTypes from "prop-types"

import { Loader, Time } from "containers"

class Skybox extends Component {
  constructor() {
    super()
    this.vertShader = Loader.getFile("skybox_vert")
    this.fragShader = Loader.getFile("skybox_frag")
  }

  render() {
    const time = Time.getTime()

    // One day every 300000 ms (5 min)
    // const skyTime =
    //   6.2831 *
    //   ((time.min * 60000 + time.sec * 1000 + time.ms) % 300000) /
    //   300000

    const skyTime = 6.2831 * ((time.sec * 1000 + time.ms) % 10000) / 10000

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
            <uniform type="f" name="time" value={skyTime} />
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
}

export default Skybox
