/* eslint-disable global-require, no-undef */
if (CLIENT) {
  require("three/examples/js/loaders/GLTFLoader")
}

class Loader {
  constructor() {
    if (CLIENT) {
      this.fileLoader = new THREE.FileLoader()
      this.GLTFLoader = new THREE.GLTFLoader()
    }

    this.cache = Object.create(null) // Empty object without __proto__ methods
    this.files = [
      {
        name: "home",
        src: require("static/models/home.glb"),
      },
      {
        name: "tree",
        src: require("static/models/tree.glb"),
      },
      {
        name: "windturbine",
        src: require("static/models/windturbine.glb"),
      },
      {
        name: "celestialbody_vert",
        src: require("static/shaders/celestialbody_vert.glsl"),
      },
      {
        name: "celestialbody_frag",
        src: require("static/shaders/celestialbody_frag.glsl"),
      },
      {
        name: "skybox_vert",
        src: require("static/shaders/skybox_vert.glsl"),
      },
      {
        name: "skybox_frag",
        src: require("static/shaders/skybox_frag.glsl"),
      },
      {
        name: "starfield_vert",
        src: require("static/shaders/starfield_vert.glsl"),
      },
      {
        name: "starfield_frag",
        src: require("static/shaders/starfield_frag.glsl"),
      },
      {
        name: "terrain_vert",
        src: require("static/shaders/terrain_vert.glsl"),
      },
      {
        name: "terrain_frag",
        src: require("static/shaders/terrain_frag.glsl"),
      },
      {
        name: "water_base_vert",
        src: require("static/shaders/water_base_vert.glsl"),
      },
      {
        name: "water_base_frag",
        src: require("static/shaders/water_base_frag.glsl"),
      },
      {
        name: "water_side_vert",
        src: require("static/shaders/water_side_vert.glsl"),
      },
      {
        name: "water_side_frag",
        src: require("static/shaders/water_side_frag.glsl"),
      },
    ]
  }

  load(func) {
    return new Promise(resolve => {
      // Use reduce to sequentially use promises and load the files
      this.files
        .reduce(
          (promise, file, index) =>
            promise.then(() => {
              if (/.glb$/.test(file.src)) {
                return this.loadModel(file, index, func)
              } else if (/.glsl$/.test(file.src)) {
                return this.loadShader(file, index, func)
              }

              throw new Error("File is not of type .glb or .glsl")
            }),
          Promise.resolve(),
        )
        .then(() => {
          // All files were succesfully loaded
          resolve()
        })
        .catch(err => new Error(err))
    })
  }

  loadModel(file, index, func) {
    return new Promise((resolve, reject) => {
      this.GLTFLoader.load(
        file.src,
        res => {
          this.cache[file.name] = res
          resolve()
        },
        xhr => {
          // Range from 0–1, indicating how much was loaded
          const fileProgress = xhr.loaded / xhr.total
          // Current file chunk
          const currentChunk = 100 / this.files.length * (index + 1)
          // Total progress
          func(fileProgress * currentChunk)
        },
        err => reject(err),
      )
    })
  }

  loadShader(file, index, func) {
    return new Promise((resolve, reject) => {
      this.fileLoader.load(
        file.src,
        res => {
          this.cache[file.name] = res
          resolve()
        },
        xhr => {
          // Range from 0–1, indicating how much was loaded
          const fileProgress = xhr.loaded / xhr.total
          // Current file chunk
          const currentChunk = 100 / this.files.length * (index + 1)
          // Total progress
          func(fileProgress * currentChunk)
        },
        err => reject(err),
      )
    })
  }

  getFile(name) {
    if (typeof this.cache[name] === "undefined") {
      throw new Error(`File named "${name}" could not be found`)
    }

    return this.cache[name]
  }
}

export default new Loader()
