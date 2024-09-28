<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getHomeVideoRecommendations } from "@/apis/video/recommend";

const router = useRouter();

const recommendations = ref<Item[]>([]);

// TODO: 滚动加载
const homeVideoRecommendations = async () => {
  await getHomeVideoRecommendations().then((response) => {
    console.log(response);
    recommendations.value = response.data.item;
  });
};

const formatPubDate = (timestamp: number): string => {
  const now = new Date().getTime();

  const seconds = Math.floor(now / 1000 - timestamp);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "刚刚";
  } else if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 7) {
    return `${days}天前`;
  } else if (days < 365) {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  } else {
    const date = new Date(timestamp);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
};

const formatDuration = (duration: number): string => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  let formattedDuration = "";

  if (hours > 0) {
    formattedDuration += hours;
    formattedDuration += ":";
    // 补零
    formattedDuration += minutes.toString().padStart(2, "0");
  } else {
    formattedDuration += minutes;
  }

  formattedDuration += ":";
  formattedDuration += seconds.toString().padStart(2, "0");

  return formattedDuration;
};

const formatView = (view: number): string => {
  if (view < 10000) {
    return view.toString();
  } else {
    return `${(view / 10000).toFixed(1)}万`;
  }
};

const toVideo = (bvid: string) => {
  router.push({ name: "Video", params: { bvid } });
};

onMounted(async () => {
  await homeVideoRecommendations();
});
</script>

<template>
  <v-container>
    <v-row no-gutters v-for="i in recommendations.length / 3" :key="i">
      <v-col
        v-for="item in recommendations.slice(3 * i - 3, 3 * i)"
        :key="item.id"
        cols="12"
        sm="4"
      >
        <v-sheet class="ma-2 pa-2"
          ><v-card>
            <v-img
              class="align-end text-white"
              height="200px"
              :src="item.pic"
              cover
              @click.prevent="toVideo(item.bvid)"
            >
              <v-icon icon="mdi-play-box"></v-icon
              >{{ formatView(item.stat.view) }}
              <v-icon icon="mdi-message-text-fast"></v-icon
              >{{ item.stat.danmaku }}
              {{ formatDuration(item.duration) }}
            </v-img>
            <v-title class="title" @click.prevent="toVideo(item.bvid)">{{
              item.title
            }}</v-title>
            <v-card-actions>
              <div @click.prevent="toVideo(item.bvid)">
                <v-avatar size="24">
                  <v-img
                    :alt="item.owner.name"
                    :src="item.owner.face"
                  ></v-img> </v-avatar
                ><v-icon v-if="item.is_followed" icon="mdi-check-circle"
                  >已关注</v-icon
                >
                {{ item.owner.name }}
                {{ formatPubDate(item.pubdate) }}
              </div>
            </v-card-actions>
          </v-card></v-sheet
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.title {
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}
</style>
