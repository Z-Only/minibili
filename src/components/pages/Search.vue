<script setup lang="ts">
import { TabItem, formatSearchTabNavNum } from '@/common/utils'
import { Pageinfo } from '@/apis/types/search'

// 获取路由参数
const route = useRoute()
const keyword = route.query.keyword as string

const tabs: Ref<TabItem[]> = ref([
    {
        text: '综合',
        value: 'all',
        number: 0,
    },
    {
        text: '视频',
        value: 'video',
        number: 0,
    },
    {
        text: '番剧',
        value: 'anime',
        number: 0,
    },
    {
        text: '影视',
        value: 'cinephile',
        number: 0,
    },
    {
        text: '直播',
        value: 'live',
        number: 0,
    },
    {
        text: '专栏',
        value: 'article',
        number: 0,
    },
    {
        text: '用户',
        value: 'user',
        number: 0,
    },
])
const tab = ref('tab-' + tabs.value[0].value)

const receiveEmitResult = (data: Pageinfo) => {
    tabs.value[1].number = data.video.numResults
    tabs.value[2].number = data.media_bangumi.numResults
    tabs.value[3].number = data.media_ft.numResults
    tabs.value[4].number = data.live.numResults
    tabs.value[5].number = data.article.numResults
    tabs.value[6].number = data.bili_user.numResults
}
</script>

<template>
    <v-sheet style="height: calc(100vh - 64px)">
        <v-tabs v-model="tab" height="60px">
            <v-tab
                v-for="item in tabs"
                :key="item.value"
                :value="'tab-' + item.value"
                class="d-flex align-center"
            >
                <span>{{ item.text }}</span
                ><span v-if="item.number" class="tab-nav-num">{{
                    formatSearchTabNavNum(item.number)
                }}</span></v-tab
            >
        </v-tabs>
        <v-tabs-window v-model="tab">
            <v-tabs-window-item
                v-for="item in tabs"
                :key="item.value"
                :value="'tab-' + item.value"
            >
                <v-layout style="height: calc(100vh - 64px - 60px)">
                    <search-all
                        v-if="item.value === 'all'"
                        :keyword="keyword"
                        @emitSearchPageInfo="receiveEmitResult"
                    ></search-all>
                    <search-video
                        v-else-if="item.value === 'video'"
                        :keyword="keyword"
                    ></search-video>
                    <search-banguni
                        v-else-if="item.value === 'anime'"
                        :keyword="keyword"
                    ></search-banguni>
                </v-layout>
            </v-tabs-window-item>
        </v-tabs-window>
    </v-sheet>
</template>

<style scoped>
.tab-nav-num {
    font-size: 0.8rem;
}
</style>
