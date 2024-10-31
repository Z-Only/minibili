<script setup lang="ts">
import { fetchVideoRecommendations } from '@/apis/video/recommend'
import { Item } from '@/apis/types/video-recommendations'
import { RecommendParams } from '@/apis/video/recommend'
import { VideoCardData } from '@/common/types/props'
import { getDataGridSlice } from '@/common/utils'
import { ShallowRef } from 'vue'

const recommendations: ShallowRef<Item[]> = shallowRef<Item[]>([])

let freshIdx = 1

/**
 * 获取首页视频推荐数据并更新到 recommendations 中。
 */
const getHomeVideoRecommendations = async (params: RecommendParams) => {
    await fetchVideoRecommendations(params)
        .then((data) => {
            recommendations.value.push(...data.item)

            // 手动触发更新
            recommendations.value = [...recommendations.value]

            freshIdx++
            console.log('freshIdx: %d', freshIdx)
        })
        .catch((error) => {
            console.error('Failed to fetch video recommendations:', error)
        })
}

type InfiniteScrollStatus = 'ok' | 'empty' | 'loading' | 'error' // Define the type

// FIXME: 滚动到底不会自动加载，手动模式有效
/**
 * 加载更多数据的方法。
 */
const load = async ({
    done,
}: {
    done: (status: InfiniteScrollStatus) => void
}) => {
    console.log('Loading more items...')

    // 首次加载时跳过
    if (freshIdx <= 1) {
        return
    }

    await getHomeVideoRecommendations({
        ps: 6,
        fresh_idx: freshIdx,
    })
        .then(() => {
            done('ok')
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

onMounted(async () => {
    await getHomeVideoRecommendations({
        ps: 12,
        fresh_idx: 1,
    })
})
</script>

<template>
    <v-container
        ><v-infinite-scroll
            mode="manual"
            :items="recommendations"
            :onLoad="load"
        >
            <template
                v-for="n in Math.floor(recommendations.length / 3)"
                :key="n"
            >
                <v-row no-gutters>
                    <v-col
                        v-for="(item, i) in getDataGridSlice(
                            recommendations,
                            n - 1,
                            3
                        )"
                        :key="i"
                        cols="12"
                        sm="4"
                    >
                        <v-skeleton-loader
                            :loading="
                                getRealIndex(n - 1, 3, i) >=
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
    </v-container>
</template>

<style scoped>
.title {
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
}
</style>
