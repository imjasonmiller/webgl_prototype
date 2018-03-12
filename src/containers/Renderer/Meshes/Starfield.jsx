import React, { Component } from "react"
import PropTypes from "prop-types"
import { Loader } from "containers"

class Starfield extends Component {
  constructor() {
    super()

    this.vertShader = Loader.getFile("starfield_vert")
    this.fragShader = Loader.getFile("starfield_frag")
  }

  componentDidMount() {
    const { count, distance, size, variance } = this.props

    // Intialize buffers
    const indices = []
    const normals = []
    const uvs = []
    const vertices = []

    let x
    let y
    let z
    let vectorLength

    for (let i = 0; i < count * 4; i += 4) {
      x = Math.random() * 2 - 1
      y = Math.random() * 2 - 1
      z = Math.random() * 2 - 1

      vectorLength = Math.hypot(x, y, z)

      // Normalize and push points outwards
      x = x / vectorLength * (Math.random() * variance + distance)
      y = y / vectorLength * (Math.random() * variance + distance)
      z = z / vectorLength * (Math.random() * variance + distance)

      const m4 = new THREE.Matrix4().lookAt(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, z),
        new THREE.Vector3(0, 1, 0),
      )

      const v0 = new THREE.Vector3(-size, size, 0)
        .applyMatrix4(m4)
        .add(new THREE.Vector3(x, y, z))

      const v1 = new THREE.Vector3(size, size, 0)
        .applyMatrix4(m4)
        .add(new THREE.Vector3(x, y, z))

      const v2 = new THREE.Vector3(-size, -size, 0)
        .applyMatrix4(m4)
        .add(new THREE.Vector3(x, y, z))

      const v3 = new THREE.Vector3(size, -size, 0)
        .applyMatrix4(m4)
        .add(new THREE.Vector3(x, y, z))

      vertices.push(v0.x, v0.y, v0.z)
      vertices.push(v1.x, v1.y, v1.z)
      vertices.push(v2.x, v2.y, v2.z)
      vertices.push(v3.x, v3.y, v3.z)

      normals.push(0, 0, 1)
      normals.push(0, 0, 1)
      normals.push(0, 0, 1)
      normals.push(0, 0, 1)

      uvs.push(0, 1)
      uvs.push(1, 1)
      uvs.push(0, 0)
      uvs.push(1, 0)

      indices.push(i + 0, i + 1, i + 2)
      indices.push(i + 1, i + 3, i + 2)
    }

    // Build geometry
    this.geo.setIndex(new THREE.Uint16BufferAttribute(indices, 1))
    this.geo.addAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    )
    this.geo.addAttribute(
      "normal",
      new THREE.Float32BufferAttribute(normals, 3),
    )
    this.geo.addAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2))
  }

  render() {
    return (
      <mesh
        position={new THREE.Vector3(0, 0, 0)}
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
          side={THREE.BackSide}
          vertexShader={this.vertShader}
          fragmentShader={this.fragShader}
          transparent
        >
          <uniforms>
            <uniform type="float" name="time" value={this.props.time} />
            <uniform
              type="vec2"
              name="winRes"
              value={
                new THREE.Vector2(this.props.winWidth, this.props.winHeight)
              }
            />
          </uniforms>
        </shaderMaterial>
      </mesh>
    )
  }
}

Starfield.propTypes = {
  count: PropTypes.number.isRequired,
  distance: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
  variance: PropTypes.number.isRequired,
  winWidth: PropTypes.number.isRequired,
  winHeight: PropTypes.number.isRequired,
}

export default Starfield
