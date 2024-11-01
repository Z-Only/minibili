<script setup lang="ts">
import { fetchSearchAll } from '@/apis/search/all'
import { SearchAll, Datum } from '@/apis/types/search-all'
import { VideoCardData } from '@/common/types/props'
import { getDataGridSlice } from '@/common/utils'
import { ShallowRef } from 'vue'

// 获取路由参数
const route = useRoute()
const videoZone = route.params.zone as string
const keyword = route.query.keyword as string

// 定义响应式数据
const searchResults: ShallowRef<SearchAll | null> = shallowRef(null)
const videos: ShallowRef<Datum[]> = shallowRef([])
const columnsPerRow = 3 // 每行显示的列数

/**
 * 将原始数据转换为适合展示的格式
 */
const transformDatum = (datum: Datum): VideoCardData => {
    return {
        id: datum.id,
        bvid: datum.bvid,
        url: datum.arcurl,
        author_name: datum.author,
        avatar_url: datum.upic,
        title: datum.title,
        pic_url: datum.pic,
        view: datum.play,
        danmaku: datum.danmaku,
        duration: datum.duration,
        pubdate: datum.pubdate,
        is_followed: false,
    }
}

/**
 * 初始化时加载搜索结果
 */
const loadSearchResults = async () => {
    try {
        const response = await fetchSearchAll({ keyword })
        searchResults.value = response

        if (searchResults.value && searchResults.value.result) {
            const videoResult = searchResults.value.result.find(
                (result) => result.result_type === 'video'
            )
            if (videoResult) {
                videos.value = videoResult.data
                // 防止生产中 devServer URL 为 tauri://localhost/ 导致没有加协议名以 // 开头的图片无法正常加载
                videos.value.forEach((video) => {
                    video.pic = video.pic.replace(/^\/\//, 'https://')
                })
            }
        }
    } catch (error) {
        console.error('Failed to fetch search results', error)
    }
}

onMounted(async () => {
    console.log('videoZone:', videoZone)
    console.log('keyword:', keyword)
    // 页面挂载时加载数据
    await loadSearchResults()
})
</script>

<template>
    <v-container>
        <!-- 遍历每一行 -->
        <v-row
            v-for="rowIndex in Math.ceil(videos.length / columnsPerRow)"
            :key="rowIndex"
            no-gutters
        >
            <!-- 遍历每列 -->
            <v-col
                v-for="(datum, index) in getDataGridSlice(
                    videos,
                    rowIndex - 1,
                    columnsPerRow
                )"
                :key="index"
                cols="12"
                sm="4"
            >
                <v-responsive>
                    <v-sheet class="ma-2 pa-2">
                        <video-card :video="transformDatum(datum)" />
                    </v-sheet>
                </v-responsive>
            </v-col>
        </v-row>
    </v-container>
</template>
