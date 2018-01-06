class Time {
  constructor() {
    this.time = Date.now()
  }

  getTime() {
    const date = new Date()
    const now = Date.now()

    return {
      delta: now - this.time,
      min: date.getUTCMinutes(),
      sec: date.getUTCSeconds(),
      ms: date.getUTCMilliseconds(),
    }
  }

  setServerTime(ms) {
    this.serverTime = ms
  }
}

export default new Time()
