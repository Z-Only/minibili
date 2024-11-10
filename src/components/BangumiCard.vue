<script setup lang="ts">
import { SearchResponseDramasOrMovies } from '@/apis/types/search-response'

// 获取路由实例
// const router = useRouter()

const { video } = defineProps<{
    video: SearchResponseDramasOrMovies
}>()
</script>

<template>
    <v-card>
        <v-card>
            <!-- 封面图片 -->
            <v-img
                class="align-end text-white"
                :src="video.cover"
                :aspect-ratio="3 / 4"
                lazy-src="https://i0.hdslb.com/bfs/archive/c8fd97a40bf79f03e7b76cbc87236f612caef7b2.png"
                cover
            >
                <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                        <v-progress-circular
                            color="grey-lighten-4"
                            indeterminate
                        ></v-progress-circular>
                    </div>
                </template>
            </v-img>
        </v-card>
        <v-card>
            <v-card-title>
                <div
                    v-html="video.title"
                    class="d-inline-block text-truncate"
                    style="max-width: 100%"
                ></div>
                <v-tooltip activator="parent" location="bottom">
                    <div v-html="video.title"></div>
                </v-tooltip>
            </v-card-title>
            <v-card-subtitle></v-card-subtitle>
            <v-card-text>
                <div>
                    <div
                        v-html="video.cv"
                        class="d-inline-block text-truncate"
                        style="max-width: 100%"
                    ></div>
                    <v-tooltip activator="parent" location="bottom">
                        <div v-html="video.cv"></div>
                    </v-tooltip>
                </div>
            </v-card-text>
        </v-card>
    </v-card>
</template>

<style scoped></style>
