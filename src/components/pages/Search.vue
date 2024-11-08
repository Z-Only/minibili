<script setup lang="ts">
import { fetchSearchAll } from '@/apis/search/search'
import { SearchAll, Datum } from '@/apis/types/search'
import {
    getDataGridSlice,
    getRealIndex,
    convertToVideoData,
    TabItem,
} from '@/common/utils'
import { ShallowRef } from 'vue'
import { useGoTo } from 'vuetify'

// 获取路由参数
const route = useRoute()
const videoZone = route.params.zone as string
const keyword = route.query.keyword as string

// 定义响应式数据
const searchResults: ShallowRef<SearchAll | null> = shallowRef(null)
const searchVideos: ShallowRef<Datum[]> = shallowRef<Datum[]>([])

const colCount = ref(2)

const goTo = useGoTo()
const gotoTop = () => {
    goTo(0, { container: '#goto-container' })
}

const tabs: Ref<TabItem[]> = ref([
    {
        text: '综合',
        value: 'all',
    },
    {
        text: '视频',
        value: 'video',
    },
    {
        text: '番剧',
        value: 'anime',
    },
    {
        text: '影视',
        value: 'cinephile',
    },
    {
        text: '直播',
        value: 'live',
    },
    {
        text: '专栏',
        value: 'article',
    },
    {
        text: '用户',
        value: 'user',
    },
])
const tab = ref('tab-' + tabs.value[0].value)

onMounted(async () => {
    console.log('videoZone:', videoZone)
    console.log('keyword:', keyword)

    // 页面挂载时加载数据
    await fetchSearchAll({ keyword })
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
    <v-sheet style="height: calc(100vh - 64px)">
        <v-tabs v-model="tab" height="60px">
            <v-tab
                v-for="item in tabs"
                :key="item.value"
                :text="item.text"
                :value="'tab-' + item.value"
            ></v-tab>
        </v-tabs>
        <v-tabs-window v-model="tab">
            <v-tabs-window-item
                v-for="item in tabs"
                :key="item.value"
                :value="'tab-' + item.value"
            >
                <v-layout
                    style="height: calc(100vh - 64px - 60px)"
                    v-if="item.value === 'all'"
                    ><v-infinite-scroll
                        :items="searchVideos"
                        id="goto-container"
                    >
                        <template
                            v-for="n in Math.floor(
                                searchVideos.length / colCount
                            )"
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
                                                        convertToVideoData(item)
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
                    ></v-fab
                ></v-layout>
            </v-tabs-window-item>
        </v-tabs-window>
    </v-sheet>
</template>
