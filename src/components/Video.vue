<script setup lang="ts">
import { fetchVideoDetails } from "@/apis/video/info";
import { VideoDetails } from "@/apis/video/types";
import { onMounted, Ref, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const videoDetails: Ref<VideoDetails | null> = ref<VideoDetails | null>(null);

const getVideoDetails = async () => {
  fetchVideoDetails({
    bvid: route.params.bvid as string,
  }).then((response) => {
    console.log(response.data);
    videoDetails.value = response.data;
  });
};

onMounted(async () => {
  await getVideoDetails();
  console.log(videoDetails.value);
});
</script>

<template>
  <v-container>
    <v-img height="200px" :src="videoDetails?.pic" cover></v-img>
  </v-container>
</template>
