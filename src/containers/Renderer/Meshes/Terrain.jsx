import React, { Component } from "react"
import PropTypes from "prop-types"

import { AltBoxBufferGeometry } from "containers/Renderer/Geometry"

import { Loader } from "containers"

import throttle from "lodash/throttle"

class Terrain extends Component {
  static roundToNearest(numToRound, numToRoundTo) {
    return Math.round(numToRound * (1 / numToRoundTo)) / (1 / numToRoundTo)
  }

  /**
   * Returns all coordinates as a square, given an origin
   * @param {Number} radius - Integer for total radius
   * @param {Number} step - Step to take for each value of radius
   * @param {Object} origin - The X, Y origin coordinates
   */
  static getCoordsInSquare(radius, step, origin) {
    const coords = []

    for (let x = 0; x <= radius; x += step) {
      for (let y = 0; y <= radius; y += step) {
        coords.push({
          x: x + origin.x,
          y: y + origin.y,
        })
      }
    }

    return coords
  }

  /**
   * Returns all coordinates as a circle, given an origin
   * @param {Number} radius - Integer for total radius
   * @param {Number} step - Step to take for each value of radius
   * @param {Object} origin - The X, Y origin coordinates
   */
  static getCoordsInCircle(radius, step, origin) {
    const coords = []

    // For speed, the other quadrants are flipped and mirrored versions of quadrant IV
    Terrain.getCoordsInSquare(radius, step, { x: 0, y: 0 })
      .filter(point => point.x * point.x + point.y * point.y <= radius * radius)
      .forEach(point => {
        // Quadrant IV
        coords.push({
          x: point.x + origin.x,
          y: point.y + origin.y,
        })

        // Quadrant III
        if (point.x > 0) {
          coords.push({
            sx: -point.x + origin.x,
            y: point.y + origin.y,
          })
        }

        // Quadrant II
        if (point.x > 0 && point.y > 0) {
          coords.push({
            x: -point.x + origin.x,
            y: -point.y + origin.y,
          })
        }

        // Quadrant I
        if (point.y > 0) {
          coords.push({
            x: point.x + origin.x,
            y: -point.y + origin.y,
          })
        }
      })

    return coords
  }

  constructor() {
    super()
    this.state = {
      mouseDown: false,
      // Current and previous terrain intersections
      currTerrainIntersect: new THREE.Vector3(),
      prevTerrainIntersect: new THREE.Vector3(),
    }

    // Current mouse position
    this.mouse = new THREE.Vector2()

    // Delta between the previous and current intersection
    this.terrainIntersectDelta = 0

    this.handleDown = this.handleDown.bind(this)
    this.handleUp = this.handleUp.bind(this)
    this.handleMove = this.handleMove.bind(this)

    // Set function that is throttled
    this.setCurrTerrainIntersect = (x, y, z) =>
      this.setState({
        currTerrainIntersect: new THREE.Vector3(x, y, z),
      })

    this.setPrevTerrainIntersect = throttle(
      (x, y, z) =>
        this.setState({
          prevTerrainIntersect: new THREE.Vector3(x, y, z),
        }),
      32,
    )

    this.vertShader = Loader.getFile("terrain_vert")
    this.fragShader = Loader.getFile("terrain_frag")
  }

  componentDidMount() {
    const { getCamera, width, widthSegments } = this.props

    // Scene camera
    this.camera = getCamera()

    // The size of each grid segment
    this.gridSize = width / widthSegments

    this.raycaster = new THREE.Raycaster()

    this.drawGeometry()

    window.addEventListener("mousedown", this.handleDown)
    window.addEventListener("mousemove", this.handleMove)
    window.addEventListener("mouseup", this.handleUp)
  }

  componentWillUnmount() {
    // Remove mesh from scene
    this.terrain.geometry.dispose()
    this.terrain.material.forEach(material => {
      material.dispose()
    })
    this.group.remove(this.terrain)
    this.terrain = undefined

    window.removeEventListener("mousedown", this.handleDown)
    window.removeEventListener("mousemove", this.handleMove)
    window.removeEventListener("mouseup", this.handleUp)
  }

  /**
   * @param {Object} coord - X and Y coordinate
   * @returns {Number} - Vertex ID
   */
  getVertexByCoord(coord) {
    const sizeXZ = this.props.width
    const segmentsXZ = this.props.widthSegments

    // Return false if vertex falls outside of terrain
    if (
      coord.x > sizeXZ / 2 ||
      coord.x < -(sizeXZ / 2) ||
      coord.y > sizeXZ / 2 ||
      coord.y < -(sizeXZ / 2)
    ) {
      return false
    }

    return Math.round(
      (coord.x + sizeXZ / 2) / (sizeXZ / segmentsXZ) +
        (coord.y + sizeXZ / 2) / (sizeXZ / segmentsXZ) * (segmentsXZ + 1),
    )
  }

  /**
   * Deform a given set of 2D coordinates
   * @param {Object} origin - Origin of deformation
   * @param {Number} radius - Radius of deformation
   * @param {Object} coords - Coordinates to be deformed
   * @param {Boolean} raise - Whether the terrain should be raised or lowered
   */
  shape(origin, radius, coords, raise) {
    // Remove coords that are out of bounds and get the vertices for those that fall inside
    const points = coords.reduce((acc, coord) => {
      const vertex = this.getVertexByCoord(coord)

      if (Number.isInteger(vertex)) {
        acc.push({ coord, vertex })
      }

      return acc
    }, [])

    // Smooth out the vertices
    points
      .map(point => {
        // Find the y-coordinates of the adjecent coords
        const adjecent = Terrain.getCoordsInCircle(
          this.gridSize,
          this.gridSize,
          point.coord,
        ).reduce((acc, coord) => {
          const vertex = this.getVertexByCoord(coord)

          if (Number.isInteger(vertex)) {
            acc.push(this.terrain.geometry.vertices[vertex].y)
          }

          return acc
        }, [])

        // Sum of point and its adjecent points their y-coordinates divided over array length
        const average = adjecent.reduce((a, b) => a + b, 0) / adjecent.length

        // Return original properties and the smoothed average
        return { ...point, average }
      })
      .forEach(point => {
        // console.log("point:", point)
        this.terrain.geometry.vertices[point.vertex].y = point.average
      })

    // The vertex at the origin limits the minimum/maximum height for deformation
    const originVertex = this.getVertexByCoord(origin)

    // Raise or lower the terrain for each point
    points.forEach(point => {
      // Point distance from origin
      const distance = Math.hypot(
        point.coord.x - origin.x,
        point.coord.y - origin.y,
      )
      // Smooth falloff from the origin
      const shapeFactor = Math.cos(Math.PI / 2 * distance / radius) * 3
      // Deform strength is relative to mouse speed
      const mouseFactor = Math.min(6, this.terrainIntersectDelta / 12)

      // Raise or lower terrain, maximum height is 125 and -75 the minimum for vertices
      if (
        raise === true &&
        this.terrain.geometry.vertices[originVertex].y <= 125
      ) {
        this.terrain.geometry.vertices[point.vertex].y +=
          shapeFactor * mouseFactor
      } else if (this.terrain.geometry.vertices[originVertex].y >= -75) {
        this.terrain.geometry.vertices[point.vertex].y -=
          shapeFactor * mouseFactor
      }
    })

    // Apply changes and update vertex positions
    this.terrain.geometry.verticesNeedUpdate = true
  }

  drawGeometry() {
    const geo = new THREE.Geometry().fromBufferGeometry(
      new AltBoxBufferGeometry(this.props),
    )

    geo.mergeVertices()
    geo.translate(0, -250, 0)

    const terrainMatSide = new THREE.MeshPhongMaterial({
      color: 0x528316,
      emissive: 0x384410,
      flatShading: true,
      polygonOffset: true,
      polygonOffsetFactor: -100.0,
    })

    const mat = [
      new THREE.ShaderMaterial({
        uniforms: Object.assign(
          {},
          THREE.UniformsLib.common,
          THREE.UniformsLib.aomap,
          THREE.UniformsLib.lightmap,
          THREE.UniformsLib.emissivemap,
          THREE.UniformsLib.bumpmap,
          THREE.UniformsLib.normalmap,
          THREE.UniformsLib.displacementmap,
          THREE.UniformsLib.fog,
          THREE.UniformsLib.lights,
          {
            diffuse: { value: new THREE.Color(0x528316) },
            emissive: { value: new THREE.Color(0x384410) },
            specular: { value: new THREE.Color(0x000000) },
            shininess: { value: 30 },
            intersect: { value: new THREE.Vector3() },
            terrainTool: { value: false },
            objectSize: { value: 0 },
          },
        ),
        lights: true,
        flatShading: true,
        vertexShader: this.vertShader,
        fragmentShader: this.fragShader,
      }),
      terrainMatSide,
      terrainMatSide,
      terrainMatSide,
      terrainMatSide,
    ]

    // Add vertices that were loaded from the database
    this.props.vertices.forEach((val, index) => {
      geo.vertices[index].y = val
    })

    this.terrain = new THREE.Mesh(geo, mat)
    this.terrain.receiveShadow = true
    this.terrain.castShadow = true
    this.terrain.name = "terrain"

    // Add to scene
    this.group.add(this.terrain)
  }

  handleUp() {
    this.setState({ mouseDown: false })
  }

  handleDown() {
    this.setState({ mouseDown: true })
  }

  handleMove(event) {
    // Current tool and window resolution
    const { tool, winWidth, winHeight } = this.props

    // Get the correct event for either a touch- or mouse-based device
    const eventX = (event.touches && event.touches[0].clientX) || event.clientX
    const eventY = (event.touches && event.touches[0].clientY) || event.clientY

    // Normalize the coordinates into a range of 0 to 1
    const pointX = eventX / winWidth
    const pointY = eventY / winHeight

    // Convert X and Y into screen coordinates
    this.mouse.set(
      pointX * 2 - 1, // from left-to-right: -1 to 1
      -pointY * 2 + 1, // from top-to-bottom: 1 to -1
    )

    if (tool === "LOWER" || tool === "RAISE") {
      // Set ray origin, direction and intersection object
      this.raycaster.setFromCamera(this.mouse, this.camera)
      const ray = this.raycaster.intersectObject(this.terrain)

      // Length will be > 0 if there was an intersection
      if (ray.length > 0) {
        const intersect = ray[0]

        this.setCurrTerrainIntersect(
          intersect.point.x,
          intersect.point.y,
          intersect.point.z,
        )
        this.setPrevTerrainIntersect(
          intersect.point.x,
          intersect.point.y,
          intersect.point.z,
        )

        // Delta between the two intersections
        this.terrainIntersectDelta = Math.hypot(
          this.state.currTerrainIntersect.x - this.state.prevTerrainIntersect.x,
          this.state.currTerrainIntersect.z - this.state.prevTerrainIntersect.z,
        )

        // Mouse/Touch is being held down
        if (this.state.mouseDown) {
          const origin = {
            x: Terrain.roundToNearest(
              this.state.currTerrainIntersect.x,
              this.gridSize,
            ),
            y: Terrain.roundToNearest(
              this.state.currTerrainIntersect.z,
              this.gridSize,
            ),
          }
          const coords = Terrain.getCoordsInCircle(50, this.gridSize, origin)

          if (tool === "RAISE") {
            this.shape(origin, 50, coords, true)
          } else {
            this.shape(origin, 50, coords)
          }

          // Update terrain shader with the current intersection point
          this.terrain.material[0].uniforms.intersect.value = new THREE.Vector3(
            this.state.currTerrainIntersect.x,
            this.state.currTerrainIntersect.y,
            this.state.currTerrainIntersect.z,
          )

          // Enable terrain deformation ring
          this.terrain.material[0].uniforms.terrainTool.value = true
        } else {
          // Disable terrain deformation ring
          this.terrain.material[0].uniforms.terrainTool.value = false
        }
      }
    }
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

Terrain.propTypes = {
  getCamera: PropTypes.func.isRequired,
  tool: PropTypes.string.isRequired,
  vertices: PropTypes.arrayOf(PropTypes.number).isRequired,
  width: PropTypes.number.isRequired,
  widthSegments: PropTypes.number.isRequired,
  winWidth: PropTypes.number.isRequired,
  winHeight: PropTypes.number.isRequired,
}

export default Terrain
