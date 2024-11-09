<script setup lang="ts">
import { ShallowRef } from 'vue'
import { SearchAll, Datum, Pageinfo } from '@/apis/types/search'
import { fetchSearchAll } from '@/apis/search/search'
import { SearchResponseVideo } from '@/apis/types/search-response'
import {
    getDataGridSlice,
    getRealIndex,
    convertToVideoData,
} from '@/common/utils'
import { useGoTo } from 'vuetify'

const colCount = ref(2)

// 定义响应式数据
const searchResults: ShallowRef<SearchAll | null> = shallowRef(null)
const searchVideos: ShallowRef<Datum[]> = shallowRef<Datum[]>([])

const goTo = useGoTo()
const gotoTop = () => {
    goTo(0, { container: '#goto-container' })
}

onBeforeRouteUpdate(async (to, _from, next) => {
    // 当路由参数发生变化时，重新获取数据
    const keyword = to.query.keyword as string
    await fetchSearchAll(keyword)
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

const emit = defineEmits<{
    emitSearchPageInfo: [data: Pageinfo]
}>()

onMounted(async () => {
    // 页面挂载时加载数据
    await fetchSearchAll(keyword)
        .then((res) => {
            if (res.result) {
                searchResults.value = res
                emit('emitSearchPageInfo', res.pageinfo)
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
