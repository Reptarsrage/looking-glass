import Axios from 'axios';
import progressTracker from './progressTracker';

export const create = (options) => {
  // Create new axios instance
  const axios = Axios.create(options);
  axios.CancelToken = Axios.CancelToken;
  axios.isCancel = Axios.isCancel;

  // Setup interceptors
  loadProgressBar(axios);

  return axios;
};

function loadProgressBar(axios) {
  let requestsCounter = 0;

  const calculatePercentage = (loaded, total) => Math.floor(loaded * 1.0) / total;

  const setupStartProgress = () => {
    axios.interceptors.request.use((config) => {
      requestsCounter += 1;
      progressTracker.start();
      config.metadata = { startTime: new Date() };
      return config;
    });
  };

  const setupUpdateProgress = () => {
    const update = (e) => progressTracker.inc(calculatePercentage(e.loaded, e.total));
    axios.defaults.onDownloadProgress = update;
    axios.defaults.onUploadProgress = update;
  };

  const setupStopProgress = () => {
    const responseFunc = (response) => {
      requestsCounter -= 1;
      if (requestsCounter === 0) {
        const duration = new Date() - response.config.metadata.startTime;
        progressTracker.done(duration);
      }
      return response;
    };

    const errorFunc = (error) => {
      requestsCounter -= 1;
      if (requestsCounter === 0) {
        progressTracker.error();
        progressTracker.done(-1);
      }
      return Promise.reject(error);
    };

    axios.interceptors.response.use(responseFunc, errorFunc);
  };

  setupStartProgress();
  setupUpdateProgress();
  setupStopProgress();
}
