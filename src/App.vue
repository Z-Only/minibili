<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const theme = ref("light");

const router = useRouter();

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
          :disabled="router.options.history.state.back != null"
          @click.prevent="router.back()"
        ></v-icon>
        <v-icon
          icon="mdi-arrow-right"
          :disabled="router.options.history.state.forward != null"
          @click.prevent="router.forward()"
        ></v-icon>
        <v-icon icon="mdi-refresh" @click.prevent="router.go(0)"></v-icon>
        <v-icon
          icon="mdi-home-outline"
          @click.prevent="router.push({ name: 'Home' })"
        ></v-icon>
        <v-spacer></v-spacer>

        <v-btn
          :prepend-icon="
            theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'
          "
          text="Toggle Theme"
          slim
          @click="onClick"
        ></v-btn>
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
