import React, { Component } from "react"
import PropTypes from "prop-types"

import { Loader } from "containers"

class Tree extends Component {
  constructor(props) {
    super(props)

    const file = Loader.getFile("tree")
    this.mesh = file.scene.clone()

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
    const { x, y, z } = this.props.position
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

Tree.defaultProps = {
  preview: false,
}

Tree.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }).isRequired,
  preview: PropTypes.bool,
}

export default Tree
