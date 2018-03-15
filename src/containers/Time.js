class Time {
  constructor() {
    this.elapsedTime = 0
    this.newTime = 0
    this.oldTime = 0
  }

  start() {
    this.newTime = (typeof performance === "undefined"
      ? Date
      : performance
    ).now()
    this.oldTime = this.newTime
  }

  getTime() {
    this.newTime = (typeof performance === "undefined"
      ? Date
      : performance
    ).now()

    const delta = (this.newTime - this.oldTime) / 1000

    this.oldTime = this.newTime

    this.elapsedTime += delta

    const time = new Date()

    return {
      delta,
      elapsedTime: this.elapsedTime,
      ms: time.getUTCMilliseconds(),
      sec: time.getUTCSeconds(),
      min: time.getUTCMinutes(),
    }
  }
}

export default new Time()
