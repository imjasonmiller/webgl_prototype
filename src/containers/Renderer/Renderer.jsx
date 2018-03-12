import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import React3 from "react-three-renderer"
import EffectComposer, {
  RenderPass,
  ShaderPass,
  CopyShader,
} from "three-effectcomposer-es6"
import Animated from "animated/lib/targets/react-dom"

import { Time } from "containers"

import {
  CelestialBody,
  Skybox,
  Starfield,
  Terrain,
  Water,
} from "containers/Renderer/Meshes"

import SSAOShader from "./PostProcessing/SSAOShader"
import FXAAShader from "./PostProcessing/FXAAShader"
import UnrealBloomPass from "./PostProcessing/UnrealBloomPass"

class Renderer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      timeNow: Date.now(),
      // timeDelta: Date.now(),
    }

    this.gameTime = new THREE.Clock()

    this.origin = new THREE.Vector3(0, 0, 0)

    this.cameraPosition = new THREE.Vector3(0, 200, 500)

    this.cameraPivotRotation = new Animated.Value(0)
    this.cameraPivotRotation
      .interpolate({
        inputRange: [0, 360],
        outputRange: [0, 6.2831],
      })
      .addListener(({ value }) => {
        this.cameraPivot.rotation.y = value
      })

    this.getCamera = this.getCamera.bind(this)

    // Water depth texture for visual cues on how shallow/deep the water is
    this.waterDepthTarget = new THREE.WebGLRenderTarget(
      props.winWidth / 3,
      props.winHeight / 3,
    )
    this.waterDepthTarget.texture.format = THREE.RGBFormat
    this.waterDepthTarget.texture.minFilter = THREE.NearestFilter
    this.waterDepthTarget.texture.magFilter = THREE.NearestFilter
    this.waterDepthTarget.texture.generateMipmaps = false
    this.waterDepthTarget.stencilBuffer = false
    this.waterDepthTarget.depthBuffer = true
    this.waterDepthTarget.depthTexture = new THREE.DepthTexture()

    // Reflection of the entire scene to be projected onto the water
    this.waterReflectTarget = new THREE.WebGLRenderTarget(
      props.winWidth / 2,
      props.winHeight / 2,
    )
    this.waterReflectTarget.texture.format = THREE.RGBFormat
    this.waterReflectTarget.stencilBuffer = false
    this.waterReflectTarget.depthBuffer = false
  }

  componentDidMount() {
    // Point spotlight targets to scene origin
    this.scene.add(this.sunLight.target)
    this.scene.add(this.moonLight.target)

    this.setupComposer()
  }

  componentWillReceiveProps(nextProps) {
    const { cameraRotation, shadowQuality } = nextProps

    if (this.props.cameraRotation !== cameraRotation) {
      Animated.spring(this.cameraPivotRotation, {
        toValue: cameraRotation,
        tension: 150,
        friction: 100,
      }).start()
    }

    // Upon a change in shadow quality, dispose the previous shadow maps for the sun and moon spotlights
    if (this.props.shadowQuality !== shadowQuality) {
      this.sunLight.shadow.map.dispose()
      this.sunLight.shadow.map = null
      this.moonLight.shadow.map.dispose()
      this.moonLight.shadow.map = null
    }
  }

  componentWillUnmount() {
    this.cameraPivotRotation.removeAllListeners()
    window.cancelAnimationFrame(this.raf)
  }

  getCamera() {
    return this.camera
  }

  setupComposer() {
    const { winWidth, winHeight } = this.props

    // Water reflection
    this.waterReflect = new THREE.Object3D()
    this.waterReflect.rotation.x = -Math.PI / 2
    this.waterReflect.position.y = -25 // Water surface level
    this.waterReflect.name = "WaterReflection"
    this.waterReflect.matrixNeedsUpdate = true

    this.waterReflectClipBias = 0.0

    this.waterReflectMirrorPlane = new THREE.Plane()
    this.waterReflectNormal = new THREE.Vector3(0, 0, 1)
    this.waterReflectMirrorWorldPosition = new THREE.Vector3()
    this.waterReflectCameraWorldPosition = new THREE.Vector3()
    this.waterReflectRotationMatrix = new THREE.Matrix4()
    this.waterReflectLookAtPosition = new THREE.Vector3(0, 0, -1)
    this.waterReflectClipPlane = new THREE.Vector4()

    this.waterReflectTextureMatrix = new THREE.Matrix4()

    this.waterReflectMirrorCamera = this.camera.clone()
    this.waterReflectMirrorCamera.matrixAutoUpdate = true

    this.water.obj.material[0].uniforms.tReflect.value = this.waterReflectTarget.texture
    this.water.obj.material[0].uniforms.textureMatrix.value = this.waterReflectTextureMatrix

    this.updateWaterReflectTextureMatrix()
    this.renderWaterReflect()

    // Scene depth texture of the entire scene for ambient occlusion
    this.sceneDepthTarget = new THREE.WebGLRenderTarget(winWidth, winHeight)
    this.sceneDepthTarget.texture.format = THREE.RGBFormat
    this.sceneDepthTarget.texture.minFilter = THREE.NearestFilter
    this.sceneDepthTarget.texture.magFilter = THREE.NearestFilter
    this.sceneDepthTarget.texture.generateMipmaps = false
    this.sceneDepthTarget.stencilBuffer = false
    this.sceneDepthTarget.depthBuffer = true
    this.sceneDepthTarget.depthTexture = new THREE.DepthTexture()

    this.composer = new EffectComposer(this.webGLRenderer)

    // Setup render pass
    const renderPass = new RenderPass(this.scene, this.camera)

    // Setup SSAO pass
    const ssaoPass = new ShaderPass(SSAOShader())
    ssaoPass.material.precision = "highp"
    ssaoPass.uniforms.tDepth.value = this.sceneDepthTarget.depthTexture
    ssaoPass.uniforms.resolution.value.set(winWidth, winHeight)
    ssaoPass.uniforms.cameraNear.value = this.camera.near
    ssaoPass.uniforms.cameraFar.value = this.camera.far
    ssaoPass.uniforms.onlyAO.value = 0

    ssaoPass.uniforms.aoClamp.value = 0.5
    ssaoPass.uniforms.lumInfluence.value = 0.3

    // Setup fast approximate anti-aliasing
    const fxaaPass = new ShaderPass(FXAAShader)
    fxaaPass.uniforms.resolution.value.set(winWidth, winHeight)

    // Setup glow pass
    const glowPass = new UnrealBloomPass(
      new THREE.Vector2(winWidth, winHeight),
      0.5,
      1.5,
      0.75,
    )

    // Copy pass
    const copyPass = new ShaderPass(CopyShader)
    copyPass.renderToScreen = true

    this.composer.addPass(renderPass)
    this.composer.addPass(ssaoPass)
    this.composer.addPass(fxaaPass)
    this.composer.addPass(glowPass)
    this.composer.addPass(copyPass)

    this.renderComposer()
  }

  updateWaterReflectTextureMatrix() {
    this.waterReflect.updateMatrixWorld()
    this.camera.updateMatrixWorld()

    this.waterReflectMirrorWorldPosition.setFromMatrixPosition(
      this.waterReflect.matrixWorld,
    )
    this.waterReflectCameraWorldPosition.setFromMatrixPosition(
      this.camera.matrixWorld,
    )

    this.waterReflectRotationMatrix.extractRotation(
      this.waterReflect.matrixWorld,
    )

    this.waterReflectNormal.set(0, 0, 1)
    this.waterReflectNormal.applyMatrix4(this.waterReflectRotationMatrix)

    const view = this.waterReflectMirrorWorldPosition
      .clone()
      .sub(this.waterReflectCameraWorldPosition)

    view.reflect(this.waterReflectNormal).negate()
    view.add(this.waterReflectMirrorWorldPosition)

    this.waterReflectRotationMatrix.extractRotation(this.camera.matrixWorld)

    this.waterReflectLookAtPosition.set(0, 0, -1)
    this.waterReflectLookAtPosition.applyMatrix4(
      this.waterReflectRotationMatrix,
    )
    this.waterReflectLookAtPosition.add(this.waterReflectCameraWorldPosition)

    const target = this.waterReflectMirrorWorldPosition
      .clone()
      .sub(this.waterReflectLookAtPosition)

    target.reflect(this.waterReflectNormal).negate()
    target.add(this.waterReflectMirrorWorldPosition)

    this.waterReflect.up.set(0, -1, 0)
    this.waterReflect.up.applyMatrix4(this.waterReflectRotationMatrix)
    this.waterReflect.up.reflect(this.waterReflectNormal).negate()

    this.waterReflectMirrorCamera.position.copy(view)
    this.waterReflectMirrorCamera.up = this.waterReflect.up
    this.waterReflectMirrorCamera.lookAt(target)

    this.waterReflectMirrorCamera.updateProjectionMatrix()
    this.waterReflectMirrorCamera.updateMatrixWorld()
    this.waterReflectMirrorCamera.matrixWorldInverse.getInverse(
      this.waterReflectMirrorCamera.matrixWorld,
    )

    // Update the texture matrix
    // prettier-ignore
    this.waterReflectTextureMatrix.set(
      0.5, 0.0, 0.0, 0.5,
      0.0, 0.5, 0.0, 0.5,
      0.0, 0.0, 0.5, 0.5,
      0.0, 0.0, 0.0, 1.0
    )

    this.waterReflectTextureMatrix.multiply(
      this.waterReflectMirrorCamera.projectionMatrix,
    )
    this.waterReflectTextureMatrix.multiply(
      this.waterReflectMirrorCamera.matrixWorldInverse,
    )

    /**
     * Now update the projection matrix with the new clip plane, implementing code from:
     * http://www.terathon.com/code/oblique.html
     * Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
     */
    this.waterReflectMirrorPlane.setFromNormalAndCoplanarPoint(
      this.waterReflectNormal,
      this.waterReflectMirrorWorldPosition,
    )
    this.waterReflectMirrorPlane.applyMatrix4(
      this.waterReflectMirrorCamera.matrixWorldInverse,
    )

    this.waterReflectClipPlane.set(
      this.waterReflectMirrorPlane.normal.x,
      this.waterReflectMirrorPlane.normal.y,
      this.waterReflectMirrorPlane.normal.z,
      this.waterReflectMirrorPlane.constant,
    )

    const q = new THREE.Vector4()
    const { projectionMatrix } = this.waterReflectMirrorCamera

    q.x =
      (Math.sign(this.waterReflectClipPlane.x) + projectionMatrix.elements[8]) /
      projectionMatrix.elements[0]

    q.y =
      (Math.sign(this.waterReflectClipPlane.y) + projectionMatrix.elements[9]) /
      projectionMatrix.elements[5]

    q.z = -1.0
    q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14]

    // Calculate the scaled plane vector
    let c = new THREE.Vector4()
    c = this.waterReflectClipPlane.multiplyScalar(
      2.0 / this.waterReflectClipPlane.dot(q),
    )

    // Replacing the third row of the projection matrix
    projectionMatrix.elements[2] = c.x
    projectionMatrix.elements[6] = c.y
    projectionMatrix.elements[10] = c.z + 1.0 - this.waterReflectClipBias
    projectionMatrix.elements[14] = c.w
  }

  renderWaterReflect() {
    if (this.waterReflect.matrixNeedsUpdate) {
      this.updateWaterReflectTextureMatrix()
    }

    this.waterReflect.matrixNeedsUpdate = true

    this.water.obj.matrixNeedsUpdate = true
    this.water.obj.visible = false

    this.webGLRenderer.render(
      this.scene,
      this.waterReflectMirrorCamera,
      this.waterReflectTarget,
      // true
    )

    this.water.obj.visible = true
  }

  renderComposer() {
    this.setState({
      timeNow: Date.now(),
      // timeDelta: Date.now() - this.state.timeNow,
      // pivotRotation: new THREE.Euler(0, this.state.pivotRotation.y + 0.01, 0),
    })

    // console.log(this.state.timeNow, this.state.timeDelta)

    // Disable elements that should not be in the ambient occlussion texture
    this.starfield.obj.visible = false
    this.skybox.obj.visible = false
    this.water.obj.visible = false

    // Disable elements that should not be in the water depth texture
    this.sun.obj.visible = false
    this.moon.obj.visible = false
    this.webGLRenderer.render(
      this.scene,
      this.camera,
      this.waterDepthTarget,
      false,
    )

    // Render the depthRenderTarget for Ambient Occlusion
    this.sun.obj.visible = true
    this.moon.obj.visible = true
    this.water.obj.visible = true
    this.webGLRenderer.render(
      this.scene,
      this.camera,
      this.sceneDepthTarget,
      false,
    )

    // Re-enable elements
    this.starfield.obj.visible = true
    this.skybox.obj.visible = true

    // Render the water reflection
    this.renderWaterReflect()

    // this.webGLRenderer.render(this.scene, this.camera)
    this.composer.render()

    this.raf = window.requestAnimationFrame(() => this.renderComposer())
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
        shadowMapEnabled
        shadowMapType={THREE.PCFSoftShadowMap}
      >
        <scene
          ref={c => {
            this.scene = c
          }}
        >
          <object3D
            ref={c => {
              this.cameraPivot = c
            }}
          >
            <perspectiveCamera
              name="camera"
              fov={75}
              aspect={winWidth / winHeight}
              near={10}
              far={2000}
              lookAt={this.origin}
              position={this.cameraPosition}
              ref={c => {
                this.camera = c
              }}
            />
          </object3D>

          <ambientLight intensity={0.1} />

          <Terrain
            width={500}
            height={500}
            depth={500}
            widthSegments={28}
            heightSegments={1}
            depthSegments={28}
            tool={this.props.tool}
            winWidth={this.props.winWidth}
            winHeight={this.props.winHeight}
            vertices={this.props.terrainVerts}
            getCamera={this.getCamera}
          />

          <Water
            width={500}
            height={100}
            depth={500}
            widthSegments={1}
            heightSegments={1}
            depthSegments={1}
            ref={c => {
              this.water = c
            }}
            getCamera={this.getCamera}
            winWidth={this.props.winWidth}
            winHeight={this.props.winHeight}
            textureWaterDepth={this.waterDepthTarget.depthTexture}
            textureWaterReflect={this.waterReflectTarget.texture}
            textureMatrix={this.waterReflectTextureMatrix}
          />

          {/* <Skybox time={Time.getTime()} /> */}
          <Skybox
            time={{ delta: 50000, min: 56, sec: 32 }}
            ref={c => {
              this.skybox = c
            }}
          />

          <Starfield
            count={750}
            distance={750}
            size={2}
            time={1000}
            variance={250}
            winWidth={winWidth}
            winHeight={winHeight}
            ref={c => {
              this.starfield = c
            }}
          />

          {/* <group
            rotation={
              new THREE.Euler(
                // Altitude, highest angle being 30 degrees
                Math.PI / 6,
                // Rotational speed, every 15000 ms = 1 rotation
                Math.PI * 2 * ((this.state.timeNow % 15000) / 15000),
                0,
              )
            }
          > */}
          <group
            rotation={
              new THREE.Euler(
                // Altitude, highest angle being 30 degrees
                Math.PI / 6,
                // Rotational speed, every 15000 ms = 1 rotation
                Math.PI * 2,
                0,
              )
            }
          >
            {/* <CelestialBody
              name="sun"
              color={new THREE.Color(0xe68c21)}
              position={new THREE.Vector3(0, 0, 750)}
              time={this.state.timeNow}
            /> */}

            <CelestialBody
              name="sun"
              color={new THREE.Color(0xe68c21)}
              position={new THREE.Vector3(0, 0, 750)}
              time={50000}
              ref={c => {
                this.sun = c
              }}
            />
            <spotLight
              angle={1}
              position={new THREE.Vector3(0, 0, 750)}
              castShadow
              decay={0}
              distance={1275}
              intensity={1}
              ref={c => {
                this.sunLight = c
              }}
              shadowCameraFov={30}
              shadowCameraNear={550}
              shadowCameraFar={1250}
              shadowMapWidth={this.props.shadowQuality}
              shadowMapHeight={this.props.shadowQuality}
            />

            {/* <CelestialBody
              name="moon"
              color={new THREE.Color(0xbfbfbf)}
              position={new THREE.Vector3(0, 0, -750)}
              time={this.state.timeNow}
            /> */}

            <CelestialBody
              name="moon"
              color={new THREE.Color(0xbfbfbf)}
              position={new THREE.Vector3(0, 0, -750)}
              time={50000}
              ref={c => {
                this.moon = c
              }}
            />
            <spotLight
              angle={1}
              position={new THREE.Vector3(0, 0, -750)}
              castShadow
              decay={0}
              distance={1275}
              intensity={1}
              ref={c => {
                this.moonLight = c
              }}
              shadowCameraFov={30}
              shadowCameraNear={550}
              shadowCameraFar={1250}
              shadowMapWidth={this.props.shadowQuality}
              shadowMapHeight={this.props.shadowQuality}
            />
          </group>
        </scene>
      </React3>
    )
  }
}

/**
 * All props are passed down to their components here due to a bug
 * @see https://github.com/toxicFork/react-three-renderer/issues/140
 */
Renderer.propTypes = {
  // player
  cameraRotation: PropTypes.number.isRequired,
  terrainVerts: PropTypes.arrayOf(PropTypes.number).isRequired,
  tool: PropTypes.string.isRequired,
  // window
  winWidth: PropTypes.number.isRequired,
  winHeight: PropTypes.number.isRequired,
  pixelRatio: PropTypes.number.isRequired,
  shadowQuality: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  // player
  cameraRotation: state.player.cameraRotation,
  terrainVerts: state.player.terrain,
  tool: state.player.tool,
  // window
  winWidth: state.window.width,
  winHeight: state.window.height,
  pixelRatio: state.window.pixelRatio,
  shadowQuality: state.config.shadowquality,
})

export default connect(mapStateToProps)(Renderer)
