<script setup lang="ts">
import { fetchVideoRecommendations } from '@/apis/video/recommend'
import { Item } from '@/apis/types/video-recommendations'
import { RecommendParams } from '@/apis/video/recommend'

const recommendations: Ref<Item[]> = ref<Item[]>([])

let freshIdx = 1

const getHomeVideoRecommendations = async (params: RecommendParams) => {
    await fetchVideoRecommendations(params).then((data) => {
        recommendations.value.push(...data.item)
        console.log(recommendations.value)
        freshIdx++
        console.log(freshIdx)
    })
}

type InfiniteScrollStatus = 'ok' | 'empty' | 'loading' | 'error' // Define the type

// FIXME: 滚动到底不会自动加载，手动模式有效
const load = async ({
    done,
}: {
    done: (status: InfiniteScrollStatus) => void
}) => {
    console.log('load')
    // 第一次进入时不加载
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

const getSlice = (rowIndex: number, colCount: number): Item[] => {
    return recommendations.value.slice(
        rowIndex * colCount,
        (rowIndex + 1) * colCount
    )
}

const getRealIndex = (rowIndex: number, colCount: number, colIndex: number) => {
    return rowIndex * colCount + colIndex
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
                        v-for="(item, i) in getSlice(n - 1, 3)"
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
                                    ><video-card :video="item"></video-card
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
