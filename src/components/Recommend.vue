<script setup lang="ts">
import { fetchVideoRecommendations } from '@/apis/video/recommend'
import { Item } from '@/apis/types/video-recommendations'
import { RecommendParams } from '@/apis/video/recommend'
import {
    getDataGridSlice,
    getRealIndex,
    InfiniteScrollStatus,
    convertToVideoData,
} from '@/common/utils'
import { ShallowRef } from 'vue'
import { useGoTo } from 'vuetify'

const recommendations: ShallowRef<Item[]> = shallowRef<Item[]>([])

const colCount = ref(2)

const pageSize = 6

/**
 * 获取首页视频推荐数据并更新到 recommendations 中。
 */
const getHomeVideoRecommendations = async (
    params: RecommendParams
): Promise<boolean> => {
    return await fetchVideoRecommendations(params)
        .then((data) => {
            if (data.item.length === 0) {
                return false
            }
            recommendations.value.push(...data.item)
            // 手动触发响应式更新
            recommendations.value = [...recommendations.value]
            return true
        })
        .catch((error) => {
            console.error('Failed to fetch video recommendations: ', error)
            return false
        })
}

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
        'Loading more recommendations, freshIdx: %s, fetchRow: %s.',
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
        :items="recommendations"
        :onLoad="load"
        id="goto-container"
    >
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
    <v-fab
        icon="mdi-chevron-double-up"
        location="bottom end"
        absolute
        @click="gotoTop"
    ></v-fab>
</template>
