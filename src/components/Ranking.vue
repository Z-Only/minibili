<script setup lang="ts">
import { ShallowRef } from 'vue'
import {
    getDataGridSlice,
    getRealIndex,
    convertToVideoData,
} from '@/common/utils'
import { fetchRanking } from '@/apis/video_ranking/ranking'
import { Ranking } from '@/apis/types/video-popular'

const { rid } = defineProps<{
    rid: number | undefined
}>()

const colCount = ref(2)

const rankingVideos: ShallowRef<Ranking[]> = ref([])

onMounted(async () => {
    await fetchRanking(rid)
        .then((data) => {
            rankingVideos.value = data.list
        })
        .catch((error) => {
            console.error('Failed to fetch ranking list: ', error)
        })
})
</script>

<template>
    <v-infinite-scroll :items="rankingVideos">
        <template
            v-for="n in Math.floor(rankingVideos.length / colCount)"
            :key="n"
        >
            <v-row no-gutters>
                <v-col
                    v-for="(item, i) in getDataGridSlice(
                        rankingVideos,
                        n - 1,
                        colCount
                    )"
                    :key="i"
                    cols="12"
                    :sm="Math.round(12 / colCount)"
                >
                    <v-skeleton-loader
                        :loading="
                            getRealIndex(n - 1, colCount, i) >=
                            rankingVideos.length
                        "
                        type="card-avatar, actions"
                    >
                        <v-responsive>
                            <v-sheet class="ma-2 pa-2"
                                ><video-card
                                    :video="convertToVideoData(item)"
                                ></video-card
                            ></v-sheet>
                        </v-responsive>
                    </v-skeleton-loader>
                </v-col>
            </v-row>
        </template>
    </v-infinite-scroll>
</template>
