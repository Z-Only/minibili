<script setup lang="ts">
import { ShallowRef } from 'vue'
import { getDataGridSlice, getRealIndex } from '@/common/utils'
import { fetchPopularPrecious } from '@/apis/video_ranking/popular'
import { PopularPrecious } from '@/apis/types/video-popular'
import { VideoCardData } from '@/common/types/props'

const popularPreciousVideos: ShallowRef<PopularPrecious[]> = shallowRef<
    PopularPrecious[]
>([])

const colCount = ref(2)

/**
 * 将 Item 转换成 VideoCardData 类型的数据。
 */
const convertToVideoData = (item: PopularPrecious): VideoCardData => {
    const data: VideoCardData = {
        id: item.aid,
        bvid: item.bvid,
        url: item.short_link_v2,
        mid: item.owner.mid,
        author_name: item.owner.name,
        avatar_url: item.owner.face,
        title: item.title,
        pic_url: item.pic,
        view: item.stat.view,
        danmaku: item.stat.danmaku,
        duration: item.duration,
        pubdate: item.pubdate,
        is_followed: false,
    }
    return data
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
    <v-infinite-scroll :items="popularPreciousVideos">
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
        </template>
    </v-infinite-scroll>
</template>
