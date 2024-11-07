<script setup lang="ts">
import { ShallowRef } from 'vue'
import {
    getDataGridSlice,
    InfiniteScrollStatus,
    convertToVideoData,
} from '@/common/utils'
import {
    fetchPopularSeriesList,
    fetchPopularSeriesOne,
} from '@/apis/video_ranking/popular'
import {
    PopularSeriesList,
    PopularSeriesOneData,
} from '@/apis/types/video-popular'

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
