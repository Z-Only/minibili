import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from "vuetify";
import { md3 } from "vuetify/blueprints";
import { zhHans, en } from "vuetify/locale";

createApp(App)
  .use(router)
  .use(
    createVuetify({
      blueprint: md3,
      locale: {
        locale: "zhHans",
        fallback: "en",
        messages: { zhHans, en },
      },
      theme: {
        defaultTheme: "light",
      },
    })
  )
  .mount("#app");
