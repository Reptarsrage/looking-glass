class ProgressTrackerInstance {
  constructor() {
    this.startCallbacks = [];
    this.incCallbacks = [];
    this.doneCallbacks = [];
    this.errorCallbacks = [];
    this.pastDurations = [3000];
  }

  estimateDuration() {
    const est = this.pastDurations.reduce((sum, d) => sum + d, 0) / this.pastDurations.length;
    console.log('ESTIMATE: ', est);
    return est;
  }

  onStart(cb) {
    this.startCallbacks.push(cb);
  }

  onInc(cb) {
    this.incCallbacks.push(cb);
  }

  onDone(cb) {
    this.doneCallbacks.push(cb);
  }

  onError(cb) {
    this.errorCallbacks.push(cb);
  }

  removeEventListeners() {
    this.startCallbacks = [];
    this.incCallbacks = [];
    this.doneCallbacks = [];
    this.errorCallbacks = [];
  }

  start() {
    this.startCallbacks.forEach((cb) => cb());
  }

  inc(num) {
    this.incCallbacks.forEach((cb) => cb(num));
  }

  done(duration) {
    if (duration > 0) {
      this.pastDurations.unshift(duration);
      if (this.pastDurations.length > 10) {
        this.pastDurations.pop();
      }
    }

    this.doneCallbacks.forEach((cb) => cb());
  }

  error() {
    this.errorCallbacks.forEach((cb) => cb());
  }
}

export default new ProgressTrackerInstance();
