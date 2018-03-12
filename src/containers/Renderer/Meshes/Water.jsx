import React, { Component } from "react"
import PropTypes from "prop-types"

import { AltBoxBufferGeometry } from "containers/Renderer/Geometry"

import { Loader } from "containers"

class Water extends Component {
  constructor() {
    super()

    this.baseVertShader = Loader.getFile("water_base_vert")
    this.baseFragShader = Loader.getFile("water_base_frag")

    this.sideVertShader = Loader.getFile("water_side_vert")
    this.sideFragShader = Loader.getFile("water_side_frag")
  }

  componentDidMount() {
    this.camera = this.props.getCamera()
    this.drawGeometry()
  }

  componentWillUnmount() {
    // Remove mesh from scene
    this.obj.geometry.dispose()
    this.obj.material.forEach(material => {
      material.dispose()
    })
    this.group.remove(this.obj)
    this.obj = undefined
  }

  drawGeometry() {
    const {
      textureMatrix,
      textureWaterDepth,
      textureWaterReflect,
      winWidth,
      winHeight,
    } = this.props

    const geo = new THREE.Geometry().fromBufferGeometry(
      new AltBoxBufferGeometry(this.props),
    )

    geo.mergeVertices()
    geo.translate(0, -75, 0)

    const waterMatBase = new THREE.ShaderMaterial({
      uniforms: {
        cameraFar: { value: this.camera.far },
        cameraNear: { value: this.camera.near },
        tDepth: { value: textureWaterDepth },
        tReflect: { value: textureWaterReflect },
        fresnelBias: { value: 0.0 },
        fresnelPower: { value: 3.5 },
        fresnelScale: { value: 1.7 },
        textureMatrix: { value: textureMatrix },
        resolution: {
          value: new THREE.Vector2(winWidth, winHeight),
        },
        intersect: { value: new THREE.Vector3() },
        terrainTool: { value: false },
        objectSize: { value: 0 },
      },
      vertexShader: this.baseVertShader,
      fragmentShader: this.baseFragShader,
      transparent: true,
    })

    const waterMatSide = new THREE.ShaderMaterial({
      uniforms: {
        cameraFar: { value: this.camera.far },
        cameraNear: { value: this.camera.near },
        mRefractionRatio: { value: 0.7521 },
        mFresnelBias: { value: 0.1 },
        mFresnelPower: { value: 2.0 },
        mFresnelScale: { value: 1.0 },
        tDepth: { value: textureWaterDepth },
        tReflect: { value: textureWaterReflect },
        resolution: {
          value: new THREE.Vector2(winWidth, winHeight),
        },
        textureMatrix: { value: textureMatrix },
      },
      vertexShader: this.sideVertShader,
      fragmentShader: this.sideFragShader,
      transparent: true,
    })

    const mat = [
      waterMatBase,
      waterMatSide,
      waterMatSide,
      waterMatSide,
      waterMatSide,
    ]

    this.obj = new THREE.Mesh(geo, mat)
    this.obj.name = "water"
    this.group.add(this.obj)
  }

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

Water.defaultProps = {
  textureMatrix: new THREE.Matrix4(),
  textureWaterDepth: new THREE.Texture(),
  textureWaterReflect: new THREE.Texture(),
}

Water.propTypes = {
  textureMatrix: PropTypes.instanceOf(THREE.Matrix4),
  textureWaterDepth: PropTypes.instanceOf(THREE.DepthTexture),
  textureWaterReflect: PropTypes.instanceOf(THREE.Texture),
  getCamera: PropTypes.func.isRequired,
  winWidth: PropTypes.number.isRequired,
  winHeight: PropTypes.number.isRequired,
}

export default Water
