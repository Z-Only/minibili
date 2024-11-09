<script setup lang="ts">
import { ShallowRef } from 'vue'
import { TypeSearchData, Datum } from '@/apis/types/search'
import { fetchTypeSearch } from '@/apis/search/search'
import { SearchResponseVideo } from '@/apis/types/search-response'
import {
    getDataGridSlice,
    getRealIndex,
    convertToVideoData,
} from '@/common/utils'
import { useGoTo } from 'vuetify'

const colCount = ref(2)

const searchResults: ShallowRef<TypeSearchData | null> = shallowRef(null)
const searchVideos: ShallowRef<Datum[]> = shallowRef<Datum[]>([])

const goTo = useGoTo()
const gotoTop = () => {
    goTo(0, { container: '#goto-container' })
}

onBeforeRouteUpdate(async (to, _from, next) => {
    const keyword = to.query.keyword as string
    await fetchTypeSearch({ keyword, search_type: 'video' })
        .then((res) => {
            if (res.result) {
                searchResults.value = res
                const result = res.result.find(
                    (result) => result.result_type === 'video'
                )
                if (result) {
                    const videoResult = result.data
                    searchVideos.value = videoResult
                }
            }
        })
        .catch((error) => {
            console.error('Failed to fetch search results, ', error)
        })
        .finally(() => {
            next()
        })
})

const { keyword } = defineProps<{
    keyword: string
}>()

onMounted(async () => {
    // FIXME: 触发风控
    // 页面挂载时加载数据
    await fetchTypeSearch({
        keyword,
        search_type: 'video',
        page: 1,
        page_size: 20,
    })
        .then((res) => {
            if (res.result) {
                searchResults.value = res
                const result = res.result.find(
                    (result) => result.result_type === 'video'
                )
                if (result) {
                    const videoResult = result.data
                    searchVideos.value = videoResult
                }
            }
        })
        .catch((error) => {
            console.error('Failed to fetch search results, ', error)
        })
})
</script>

<template>
    <v-infinite-scroll :items="searchVideos" id="goto-container">
        <template
            v-for="n in Math.floor(searchVideos.length / colCount)"
            :key="n"
        >
            <v-row no-gutters>
                <v-col
                    v-for="(item, i) in getDataGridSlice(
                        searchVideos,
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
                            searchVideos.length
                        "
                        type="card-avatar, actions"
                    >
                        <v-responsive>
                            <v-sheet class="ma-2 pa-2"
                                ><video-card
                                    :video="
                                        convertToVideoData(
                                            item as SearchResponseVideo
                                        )
                                    "
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
