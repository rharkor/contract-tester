import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Toast, { POSITION } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

createApp(App)
  .use(store)
  .use(router)
  .use(Toast, {
    position: POSITION.BOTTOM_RIGHT,
    timeout: 5000,
  })
  .mount("#app");
