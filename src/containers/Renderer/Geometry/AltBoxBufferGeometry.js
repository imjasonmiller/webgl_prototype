/**
 * Modified version of BoxBufferGeometry that has:
 * - Alternating triangle strips, allowing for better deformation
 * @see https://stackoverflow.com/q/47917067/1113913
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 */
class AltBoxBufferGeometry {
  constructor({
    width = 1,
    height = 1,
    depth = 1,
    widthSegments = 1,
    heightSegments = 1,
    depthSegments = 1,
  } = {}) {
    // Geometry that will be converted
    this.tempGeometry = new THREE.BufferGeometry()

    // Buffers
    this.indices = []
    this.vertices = []
    this.normals = []
    this.uvs = []

    // Helpers
    this.numberOfVertices = 0
    this.groupStart = 0

    // prettier-ignore
    this.buildPlane("x", "z", "y",  1,  1, width,  depth,  height, widthSegments,  depthSegments, true,  0) // +Y plane
    // prettier-ignore
    this.buildPlane("z", "y", "x", -1, -1, depth, height,   width, depthSegments, heightSegments, false, 1) // +X plane
    // prettier-ignore
    this.buildPlane("z", "y", "x",  1, -1, depth, height,  -width, depthSegments, heightSegments, false, 2) // -X plane
    // prettier-ignore
    this.buildPlane("x", "y", "z",  1, -1, width, height,   depth, widthSegments, heightSegments, false, 3) // +Z plane
    // prettier-ignore
    this.buildPlane("x", "y", "z", -1, -1, width, height,  -depth, widthSegments, heightSegments, false, 4) // -Z plane

    // Build geometry
    this.tempGeometry.setIndex(this.indices)
    this.tempGeometry.addAttribute(
      "position",
      new THREE.Float32BufferAttribute(this.vertices, 3),
    )
    this.tempGeometry.addAttribute(
      "normal",
      new THREE.Float32BufferAttribute(this.normals, 3),
    )
    this.tempGeometry.addAttribute(
      "uv",
      new THREE.Float32BufferAttribute(this.uvs, 2),
    )

    return this.tempGeometry
  }

  buildPlane(
    u,
    v,
    w,
    udir,
    vdir,
    width,
    height,
    depth,
    gridX,
    gridY,
    alt,
    materialIndex,
  ) {
    const segmentWidth = width / gridX
    const segmentHeight = height / gridY

    const widthHalf = width / 2
    const heightHalf = height / 2
    const depthHalf = depth / 2

    const gridX1 = gridX + 1
    const gridY1 = gridY + 1

    let vertexCounter = 0
    let groupCount = 0

    const vector = new THREE.Vector3()

    // Generate vertices, normals and uvs
    for (let iy = 0; iy < gridY1; iy += 1) {
      const y = iy * segmentHeight - heightHalf

      for (let ix = 0; ix < gridX1; ix += 1) {
        const x = ix * segmentWidth - widthHalf

        // Set values to correct vector component
        vector[u] = x * udir
        vector[v] = y * vdir
        vector[w] = depthHalf

        // Now apply vector to vertex buffer
        this.vertices.push(vector.x, vector.y, vector.z)

        // Set values to correct vector component
        vector[u] = 0
        vector[v] = 0
        vector[w] = depth > 0 ? 1 : -1

        // Now apply vector to normal buffer
        this.normals.push(vector.x, vector.y, vector.z)

        // UVs
        this.uvs.push(ix / gridX)
        this.uvs.push(1 - iy / gridY)

        // Counters
        vertexCounter += 1
      }
    }

    // Indices
    for (let iy = 0; iy < gridY; iy += 1) {
      for (let ix = 0; ix < gridX; ix += 1) {
        const a = this.numberOfVertices + ix + gridX1 * iy
        const b = this.numberOfVertices + ix + gridX1 * (iy + 1)
        const c = this.numberOfVertices + (ix + 1) + gridX1 * (iy + 1)
        const d = this.numberOfVertices + (ix + 1) + gridX1 * iy

        // Faces
        if (alt) {
          /**
           *  Alternating triangle strip for better deformation
           * +-------+-------+-------+-------+
           * | 1   * | *   4 | 1   * | *   4 |
           * |   *   |   *   |   *   |   *   |
           * | *   2 | 3   * | *   2 | 3   * |
           * +-------+-------+-------+-------+
           * | *   4 | 1   * | *   4 | 1   * |
           * |   *   |   *   |   *   |   *   |
           * | 3   * | *   2 | 3   * | *   2 |
           * +-------+-------+-------+-------+
           */

          if ((ix + iy) % 2 === 0) {
            this.indices.push(a, b, d) // Face 1
            this.indices.push(b, c, d) // Face 2
          } else {
            this.indices.push(a, b, c) // Face 3
            this.indices.push(a, c, d) // Face 4
          }
        } else {
          /**
           *  Regular triangle strip
           * +-------+-------+-------+-------+
           * | 1   * | 1   * | 1   * | 1   * |
           * |   *   |   *   |   *   |   *   |
           * | *   2 | *   2 | *   2 | *   2 |
           * +-------+-------+-------+-------+
           * | 1   * | 1   * | 1   * | 1   * |
           * |   *   |   *   |   *   |   *   |
           * | *   2 | *   2 | *   2 | *   2 |
           * +-------+-------+-------+-------+
           */

          this.indices.push(a, b, d) // Face 1
          this.indices.push(b, c, d) // Face 2
        }

        // Increase counter
        groupCount += 6
      }
    }
    // Add a group to the geometry. This will ensure multi-material support
    this.tempGeometry.addGroup(this.groupStart, groupCount, materialIndex)

    // Calculate new start value for groups
    this.groupStart += groupCount

    // Update total number of vertices
    this.numberOfVertices += vertexCounter
  }
}

export default AltBoxBufferGeometry
