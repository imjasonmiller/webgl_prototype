import React, { Component } from "react"
import PropTypes from "prop-types"

import { Loader, Time } from "containers"

class Windturbine extends Component {
  constructor(props) {
    super(props)

    const file = Loader.getFile("windturbine")
    this.mesh = file.scene.clone()

    // Translucent material if it is a preview
    if (props.preview) {
      /* eslint-disable no-param-reassign */
      this.mesh.traverse(node => {
        if (node.isMesh) {
          node.material = node.material.clone()
          node.material.flatShading = true
          node.material.opacity = 0.5
          node.material.transparent = true
          node.material.needsUpdate = true
        }
      })
    }

    // Enable shadows on meshes
    this.mesh.traverse(node => {
      if (node.isMesh) {
        node.castShadow = true
      }
    })
  }

  componentDidMount() {
    this.group.add(this.mesh)
  }

  componentWillUpdate() {
    const time = Time.getTime()
    // One rotation every 4000 ms
    this.mesh.getObjectByName("windturbine_rotor").rotation.y =
      -6.28 * (((time.sec * 1000 + time.ms) % 4000) / 4000)
  }

  componentWillUnmount() {
    // Remove meshes from scene
    this.mesh.traverse(node => {
      if (node.isMesh) {
        node.geometry.dispose()
        node.material.dispose()
        node = undefined
      }
    })

    this.group.remove(this.mesh)
    this.mesh = undefined
  }

  render() {
    const { position: { x, y, z } } = this.props
    const position = new THREE.Vector3(x, y, z)

    return (
      <group
        position={position}
        ref={c => {
          this.group = c
        }}
      />
    )
  }
}

Windturbine.defaultProps = {
  preview: false,
}

Windturbine.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }).isRequired,
  preview: PropTypes.bool,
}

export default Windturbine
