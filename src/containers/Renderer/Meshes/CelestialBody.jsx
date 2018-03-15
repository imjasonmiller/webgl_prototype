import React, { Component } from "react"
import PropTypes from "prop-types"

import { Loader, Time } from "containers"

class CelestialBody extends Component {
  constructor() {
    super()
    this.vertShader = Loader.getFile("celestialbody_vert")
    this.fragShader = Loader.getFile("celestialbody_frag")
  }

  componentDidMount() {
    let geo = new THREE.IcosahedronBufferGeometry(100, 1)
    const faceColors = []

    let randomIntensity

    for (let face = 0; face < geo.attributes.position.array.length; face += 3) {
      // Random value ranging from 0 – pi * 2
      randomIntensity = Math.random() * Math.PI * 2
      faceColors[face + 0] = randomIntensity
      faceColors[face + 1] = randomIntensity
      faceColors[face + 2] = randomIntensity
    }

    // Copy icosahedron geometry to bufferGeometry
    this.geo.copy(geo)
    this.geo.addAttribute(
      "faceColor",
      new THREE.Float32BufferAttribute(faceColors, 1),
    )

    // Remove IcosahedronBufferGeometry
    geo.dispose()
    geo = undefined
  }

  render() {
    const time = Time.getTime()

    // Complete in 5 seconds
    const shineTime = ((time.sec * 1000 + time.ms) % 5000) / 5000

    return (
      <mesh
        ref={c => {
          this.obj = c
        }}
      >
        <bufferGeometry
          index={null}
          ref={c => {
            this.geo = c
          }}
        />
        <shaderMaterial
          fragmentShader={this.fragShader}
          vertexShader={this.vertShader}
        >
          <uniforms>
            <uniform type="v3" name="color" value={this.props.color} />
            <uniform type="f" name="time" value={shineTime} />
          </uniforms>
        </shaderMaterial>
      </mesh>
    )
  }
}

CelestialBody.propTypes = {
  color: PropTypes.instanceOf(THREE.Color).isRequired,
}

export default CelestialBody
