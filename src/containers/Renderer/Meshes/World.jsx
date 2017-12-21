import React, { Component } from "react"
import { AltBoxBufferGeometry } from "containers/Renderer/Geometry"

class World extends Component {
  constructor() {
    super()
    this.state = {}
  }

  componentDidMount() {
    this.drawWorld()
  }

  drawWorld() {
    // Geometry
    const geo = new THREE.Geometry().fromBufferGeometry(
      new AltBoxBufferGeometry(this.props),
    )
    geo.mergeVertices()
    geo.translate(0, -250, 0)

    // Material
    const mat = [
      new THREE.MeshBasicMaterial({ color: 0xff00ff }),
      new THREE.MeshBasicMaterial({ color: 0xffff00 }),
      new THREE.MeshBasicMaterial({ color: 0x00ffff }),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
      new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    ]

    const mesh = new THREE.Mesh(geo, mat)
    mesh.name = "terrain"

    // Add to scene
    this.terrain.add(mesh)
  }

  render() {
    return (
      <group
        ref={c => {
          this.terrain = c
        }}
      />
    )
  }
}

export default World
