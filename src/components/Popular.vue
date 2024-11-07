<script setup lang="ts">
import { ShallowRef } from 'vue'
import {
    getDataGridSlice,
    getRealIndex,
    InfiniteScrollStatus,
    convertToVideoData,
} from '@/common/utils'
import { fetchPopular, PopularParams } from '@/apis/video_ranking/popular'
import { PopularItem } from '@/apis/types/video-popular'
import { useGoTo } from 'vuetify'

const popularVideos: ShallowRef<PopularItem[]> = shallowRef<PopularItem[]>([])

const colCount = ref(2)

const pageSize = 6

const getPopularVideos = async (params: PopularParams): Promise<boolean> => {
    return await fetchPopular(params)
        .then((data) => {
            if (data.list.length === 0) {
                return false
            }
            popularVideos.value.push(...data.list)
            // 手动触发响应式更新
            popularVideos.value = [...popularVideos.value]
            return true
        })
        .catch((error) => {
            console.error('Failed to fetch popular videos: ', error)
            return false
        })
}

const load = async ({
    done,
}: {
    done: (status: InfiniteScrollStatus) => void
}) => {
    const pageNumber = 1 + Math.round(popularVideos.value.length / pageSize)

    console.log(
        'Loading more items, pageNumber: %d, pageSize: %d.',
        pageNumber,
        pageSize
    )

    await getPopularVideos({
        pn: pageNumber,
        ps: pageSize,
    })
        .then((res) => {
            if (!res) {
                done('empty')
            } else {
                done('ok')
            }
        })
        .catch(() => {
            done('error')
        })
}

const goTo = useGoTo()
const gotoTop = () => {
    goTo(0, { container: '#goto-container' })
}
</script>

<template>
    <v-infinite-scroll
        :items="popularVideos"
        :onLoad="load"
        id="goto-container"
    >
        <template
            v-for="n in Math.floor(popularVideos.length / colCount)"
            :key="n"
        >
            <v-row no-gutters>
                <v-col
                    v-for="(item, i) in getDataGridSlice(
                        popularVideos,
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
                            popularVideos.length
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
