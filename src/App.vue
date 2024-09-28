<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

// TODO: 启动时自动加载主题设置
const theme = ref("light");

const router = useRouter();

const backDisabled = () => {
  return router.options.history.state.back == null;
};

const forwardDisabled = () => {
  return router.options.history.state.forward == null;
};

const onClick = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
};
</script>

<template>
  <v-responsive class="border rounded" max-height="3000">
    <v-app :theme="theme">
      <v-app-bar title="MiniBili" class="px-3">
        <v-icon
          icon="mdi-arrow-left"
          :disabled="backDisabled()"
          @click.prevent="router.back()"
        ></v-icon>
        <v-icon
          icon="mdi-arrow-right"
          :disabled="forwardDisabled()"
          @click.prevent="router.forward()"
        ></v-icon>
        <v-icon icon="mdi-refresh" @click.prevent="router.go(0)"></v-icon>
        <v-icon
          icon="mdi-home-outline"
          @click.prevent="router.push({ name: 'Home' })"
        ></v-icon>
        <v-spacer></v-spacer>
        <v-icon :icon="'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" @click="onClick"></v-icon>
      </v-app-bar>

      <v-navigation-drawer>
        <v-list>
          <v-list-item title="Navigation drawer"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-container>
          <RouterView />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<style scoped></style>
