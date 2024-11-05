<script setup lang="ts">
import { fetchVideoRecommendations } from '@/apis/video/recommend'
import { Item } from '@/apis/types/video-recommendations'
import { RecommendParams } from '@/apis/video/recommend'
import { VideoCardData } from '@/common/types/props'
import { getDataGridSlice } from '@/common/utils'
import { ShallowRef } from 'vue'

const recommendations: ShallowRef<Item[]> = shallowRef<Item[]>([])

const colCount = ref(2)

const pageSize = 6

/**
 * 获取首页视频推荐数据并更新到 recommendations 中。
 */
const getHomeVideoRecommendations = async (
    params: RecommendParams
): Promise<number> => {
    return await fetchVideoRecommendations(params)
        .then((data) => {
            recommendations.value.push(...data.item)
            // 手动触发响应式更新
            recommendations.value = [...recommendations.value]
            return data.item.length
        })
        .catch((error) => {
            console.error('Failed to fetch video recommendations:', error)
            return 0
        })
}

type InfiniteScrollStatus = 'ok' | 'empty' | 'loading' | 'error' // Define the type

/**
 * 加载更多数据的方法。
 */
const load = async ({
    done,
}: {
    done: (status: InfiniteScrollStatus) => void
}) => {
    const freshIdx = 1 + Math.round(recommendations.value.length / pageSize)

    const fetchRow =
        1 +
        Math.round((recommendations.value.length + pageSize) / colCount.value)

    console.log(
        'Loading more items, freshIdx: %s, fetchRow: %s.',
        freshIdx,
        fetchRow
    )

    await getHomeVideoRecommendations({
        ps: pageSize,
        fresh_idx: freshIdx,
        fresh_idx_1h: freshIdx,
        fetch_row: fetchRow,
    })
        .then((res) => {
            if (res < 1) {
                done('empty')
            } else {
                done('ok')
            }
        })
        .catch(() => {
            done('error')
        })
}

/**
 * 计算实际索引位置。
 */
const getRealIndex = (rowIndex: number, colCount: number, colIndex: number) => {
    return rowIndex * colCount + colIndex
}

/**
 * 将 Item 转换成 VideoCardData 类型的数据。
 */
const convertToVideoData = (item: Item): VideoCardData => {
    const data: VideoCardData = {
        id: item.id,
        bvid: item.bvid,
        url: item.uri,
        mid: item.owner.mid,
        author_name: item.owner.name,
        avatar_url: item.owner.face,
        title: item.title,
        pic_url: item.pic,
        view: item.stat.view,
        danmaku: item.stat.danmaku,
        duration: item.duration,
        pubdate: item.pubdate,
        is_followed: item.is_followed === 0 ? false : true,
    }
    return data
}
</script>

<template>
    <v-infinite-scroll :items="recommendations" :onLoad="load">
        <template
            v-for="n in Math.floor(recommendations.length / colCount)"
            :key="n"
        >
            <v-row no-gutters>
                <v-col
                    v-for="(item, i) in getDataGridSlice(
                        recommendations,
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
                            recommendations.length
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
