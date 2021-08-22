class ProgressTrackerInstance {
  constructor() {
    this.startCallbacks = []
    this.incCallbacks = []
    this.doneCallbacks = []
    this.errorCallbacks = []
    this.pastDurations = [1000]
    this.initialized = false
  }

  estimateDuration() {
    return this.pastDurations.reduce((sum, d) => sum + d, 0) / this.pastDurations.length
  }

  onStart(cb) {
    this.startCallbacks.push(cb)
  }

  onInc(cb) {
    this.incCallbacks.push(cb)
  }

  onDone(cb) {
    this.doneCallbacks.push(cb)
  }

  onError(cb) {
    this.errorCallbacks.push(cb)
  }

  removeEventListeners() {
    this.startCallbacks = []
    this.incCallbacks = []
    this.doneCallbacks = []
    this.errorCallbacks = []
  }

  start() {
    this.startCallbacks.forEach((cb) => cb())
  }

  inc(num) {
    this.incCallbacks.forEach((cb) => cb(num))
  }

  done(duration) {
    // ignore cached responses (< 100ms)
    if (duration > 100) {
      if (!this.initialized) {
        this.pastDurations.pop() // remove placeholder estimate
        this.initialized = true
      }

      this.pastDurations.unshift(duration)
      if (this.pastDurations.length > 10) {
        this.pastDurations.pop()
      }
    }

    this.doneCallbacks.forEach((cb) => cb())
  }

  error() {
    this.errorCallbacks.forEach((cb) => cb())
  }
}

export default new ProgressTrackerInstance()
