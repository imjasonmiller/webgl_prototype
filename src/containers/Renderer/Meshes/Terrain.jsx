import React, { Component } from "react"
import { AltBoxBufferGeometry } from "containers/Renderer/Geometry"

import { Loader } from "containers"

class Terrain extends Component {
  constructor() {
    super()
    this.state = {}
    this.vertShader = Loader.getFile("terrain_vert")
    this.fragShader = Loader.getFile("terrain_frag")
  }

  componentDidMount() {
    this.drawGeometry()

    this.raycaster = new THREE.Raycaster()

    window.addEventListener("mousemove", this.handleMove)
  }

  componentWillUnmount() {
    // Remove mesh from scene
    this.terrain.geometry.dispose()
    this.terrain.material.dispose()
    this.group.remove(this.terrain)
    this.terrain = undefined

    window.removeEventListener("mousemove", this.handleMove)
  }

  drawGeometry() {
    const geo = new THREE.Geometry().fromBufferGeometry(
      new AltBoxBufferGeometry(this.props),
    )
    geo.mergeVertices()
    geo.translate(0, -250, 0)

    const mat = [
      new THREE.ShaderMaterial({
        flatShading: true,
        vertexShader: this.vertShader,
        fragmentShader: this.fragShader,
      }),
      new THREE.MeshBasicMaterial({ color: 0xffff00 }),
      new THREE.MeshBasicMaterial({ color: 0x00ffff }),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
      new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    ]

    this.terrain = new THREE.Mesh(geo, mat)
    this.terrain.name = "terrain"

    // Add to scene
    this.group.add(this.terrain)
  }

  // handleMove(e) {
  //   console.log(e)
  // }

  render() {
    return (
      <group
        ref={c => {
          this.group = c
        }}
      />
    )
  }
}

export default Terrain
