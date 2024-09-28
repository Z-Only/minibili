import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { md3 } from "vuetify/blueprints";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import { zhHans, en } from "vuetify/locale";

createApp(App)
  .use(router)
  .use(
    createVuetify({
      blueprint: md3,
      icons: {
        defaultSet: "mdi",
        aliases,
        sets: {
          mdi,
        },
      },
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
