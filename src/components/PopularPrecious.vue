<script setup lang="ts">
import { ShallowRef } from 'vue'
import {
    getDataGridSlice,
    getRealIndex,
    convertToVideoData,
} from '@/common/utils'
import { fetchPopularPrecious } from '@/apis/video_ranking/popular'
import { PopularPrecious } from '@/apis/types/video-popular'
import { useGoTo } from 'vuetify'

const popularPreciousVideos: ShallowRef<PopularPrecious[]> = shallowRef<
    PopularPrecious[]
>([])

const colCount = ref(2)

const goTo = useGoTo()
const gotoTop = () => {
    goTo(0, { container: '#goto-container' })
}

onMounted(async () => {
    await fetchPopularPrecious()
        .then((data) => {
            popularPreciousVideos.value = data.list
        })
        .catch((error) => {
            console.error('Failed to fetch popular videos: ', error)
        })
})
</script>

<template>
    <v-infinite-scroll :items="popularPreciousVideos" id="goto-container">
        <template
            v-for="n in Math.floor(popularPreciousVideos.length / colCount)"
            :key="n"
        >
            <v-row no-gutters>
                <v-col
                    v-for="(item, i) in getDataGridSlice(
                        popularPreciousVideos,
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
                            popularPreciousVideos.length
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
        </template> </v-infinite-scroll
    ><v-fab
        icon="mdi-chevron-double-up"
        location="bottom end"
        absolute
        @click="gotoTop"
    ></v-fab>
</template>
