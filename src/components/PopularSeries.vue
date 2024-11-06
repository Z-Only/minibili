<script setup lang="ts">
import { ShallowRef } from 'vue'
import { getDataGridSlice, InfiniteScrollStatus } from '@/common/utils'
import {
    fetchPopularSeriesList,
    fetchPopularSeriesOne,
} from '@/apis/video_ranking/popular'
import {
    PopularSeriesList,
    PopularSeriesOneData,
    PopularSeries,
} from '@/apis/types/video-popular'
import { VideoCardData } from '@/common/types/props'

const popularSeriesList: ShallowRef<PopularSeriesList | null> =
    shallowRef<PopularSeriesList | null>(null)
const popularSeriesData: ShallowRef<PopularSeriesOneData[]> = shallowRef<
    PopularSeriesOneData[]
>([])

const colCount = ref(2)

const seriesNumber = ref(1)

const getPopularSeriesVideos = async (number: number): Promise<boolean> => {
    return await fetchPopularSeriesOne(number)
        .then((data) => {
            if (data.list.length === 0) {
                return false
            }
            popularSeriesData.value.push(data)
            // 手动触发响应式更新
            popularSeriesData.value = [...popularSeriesData.value]
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
    console.log('Loading more items, seriesNumber: %d.', seriesNumber)

    if (seriesNumber.value < 1) {
        done('empty')
    }

    await getPopularSeriesVideos(seriesNumber.value)
        .then((res) => {
            if (!res) {
                done('empty')
            } else {
                seriesNumber.value--
                done('ok')
            }
        })
        .catch(() => {
            done('error')
        })
}

/**
 * 将 PopularSeriesOneData 中的 List 转换成 VideoCardData 类型的数据。
 */
const convertToVideoData = (item: PopularSeries): VideoCardData => {
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
    await fetchPopularSeriesList()
        .then((data) => {
            popularSeriesList.value = data
            // 从最后一期开始
            seriesNumber.value = popularSeriesList.value.list[0].number
        })
        .catch((error) => {
            console.error('Failed to fetch popular series list: ', error)
        })
})
</script>

<template>
    <v-infinite-scroll :items="popularSeriesData" :onLoad="load">
        <template
            v-for="series in popularSeriesData"
            :key="series.config.number"
        >
            <span
                >{{ series.config.name }}&nbsp;{{ series.config.subject }}</span
            >
            <v-row
                v-for="n in Math.floor(series.list.length / colCount)"
                :key="n"
                no-gutters
            >
                <v-col
                    v-for="(item, i) in getDataGridSlice(
                        series.list,
                        n - 1,
                        colCount
                    )"
                    :key="i"
                    cols="12"
                    :sm="Math.round(12 / colCount)"
                >
                    <v-responsive>
                        <v-sheet class="ma-2 pa-2"
                            ><video-card
                                :video="convertToVideoData(item)"
                            ></video-card
                        ></v-sheet>
                    </v-responsive>
                </v-col>
            </v-row>
        </template>
    </v-infinite-scroll>
</template>
