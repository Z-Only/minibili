<script setup lang="ts">
import { fetchSearchAll } from '@/apis/search/all'
import { SearchAll, Datum } from '@/apis/types/search-all'
import { VideoCardData } from '@/common/types/video-card-data'
import { getDataGridSlice } from '@/common/utils'

const route = useRoute()

const videoZone = route.params.zone as string
const keyword = route.query.keyword as string

console.log('videoZone: %s, keyword: %s', videoZone, keyword)

const searchAll: Ref<SearchAll | null> = ref<SearchAll | null>(null)

const videoDatums: Ref<Datum[]> = ref<Datum[]>([])

const colCount = 3

const convertToVideoData = (item: Datum): VideoCardData => {
    const data: VideoCardData = {
        id: item.id,
        bvid: item.bvid,
        url: item.arcurl,
        author_name: item.author,
        avatar_url: item.upic,
        title: item.title,
        pic_url: item.pic,
        view: item.play,
        danmaku: item.danmaku,
        duration: item.duration,
        pubdate: item.pubdate,
        is_followed: false,
    }
    return data
}

onMounted(async () => {
    await fetchSearchAll({ keyword }).then((res) => {
        searchAll.value = res
        videoDatums.value = searchAll.value?.result.find(
            (item) => item.result_type === 'video'
        )!.data
    })
})
</script>

<template>
    <v-container>
        <v-row
            v-for="n in Math.floor(videoDatums.length / colCount)"
            :key="n"
            no-gutters
        >
            <v-col
                v-for="(item, i) in getDataGridSlice(videoDatums, n - 1, 3)"
                :key="i"
                cols="12"
                sm="4"
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
    </v-container>
</template>
