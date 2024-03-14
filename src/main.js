import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";

import axios from "axios";


axios.defaults.baseURL = "https://cax.piccadilly.autonity.org/";

axios.interceptors.request.use((config) => {
    config.headers["API-Key"] = window.localStorage.getItem("api_key");
      return config;
});

const app = createApp(App);

const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 200);
    super(callback);
  }
};


app.use(axios);
app.use(ElementPlus);
app.mount("#app");
