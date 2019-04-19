// Loads images in memory to get their dimensions
export default class asyncImageLoader {
  static instance;

  static cache = {};

  static debug = false; // logs to console

  constructor() {
    if (this.constructor.instance) {
      return this.constructor.instance;
    }

    this.interval = 50;
    this.pendingImages = [];
    this.intervalId = null;
    this.constructor.instance = this;
  }

  log = (s, v) => {
    if (this.constructor.debug) console.log(s, v);
  };

  // Stops polling for image completion
  stopPolling = () => {
    if (this.intervalId !== null) {
      this.log('stop');
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  };

  // Begins polling for image completion
  startPolling = () => {
    if (this.intervalId === null) {
      this.log('start');
      this.intervalId = setInterval(this.checkPendingImgages, this.interval);
    }
  };

  // Checks all images for completion
  // Stops polling if all complete
  checkPendingImgages = () => {
    if (this.pendingImages.length === 0) {
      this.stopPolling();
      return;
    }

    this.log('poll');
    for (let index = 0; index < this.pendingImages.length; index += 1) {
      const { image, resolve } = this.pendingImages[index];
      const { naturalWidth: width, naturalHeight: height } = image.naturalWidth;
      if (width && height) {
        this.log('LOADED', { width, height, index });
        // Remove image from pending itmes
        this.pendingImages.splice(index, 1);

        // Stop image from loading any further
        this.disposeOfImage(image);

        // Resolve promise
        resolve(width, height);
      }
    }
  };

  // Disposes of an image object
  // This stops the image from loading any further
  disposeOfImage = image => {
    /* eslint-disable no-param-reassign */
    image.onload = null;
    image.onerror = null;
    image.src = '';
    image = null;
    /* eslint-enable no-param-reassign */
  };

  // Loads image into memory just far enough to get its diumensions
  // Returns a promise containing the dimensions of the image.
  loadImageAsync = src => {
    if (src in this.constructor.cache) {
      this.log('cached', { src });
      return this.constructor.cache[src];
    }

    this.constructor.cache[src] = new Promise((resolve, reject) => {
      // Create image object in memory
      const image = new Image();

      // Add image to pending items
      this.pendingImages.push({ image, resolve, reject, src });

      // Start if not already
      this.startPolling();

      // Set-up onload event
      // This works better for smaller images
      image.onload = e => {
        const { target } = e;
        const {
          naturalWidth: width,
          naturalHeight: height,
          src: source
        } = target;
        const index = this.pendingImages.findIndex(img => img.src === source);
        this.log('loaded', { width, height, index });

        // Remove image from pending itmes
        this.pendingImages.splice(index, 1);

        // Stop image from loading any further
        this.disposeOfImage(image);

        // Resolve promise
        resolve({ width, height });
      };

      // Set-up image error handeling
      // NOTE: There is no way to prevent the browser from logging these errors to the console
      image.onerror = e => {
        const { target } = e;
        const { src: source } = target;
        const index = this.pendingImages.findIndex(img => img.src === source);
        this.log('errored', { source, index });

        // Remove image from pending itmes
        this.pendingImages.splice(index, 1);

        // Stop image from loading any further
        this.disposeOfImage(image);

        // Resolve promise
        reject(e);
      };

      // Begin loading image
      image.src = src;
    });

    return this.constructor.cache[src];
  };
}
