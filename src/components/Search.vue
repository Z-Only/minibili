<script setup lang="ts">
import { get } from '@/apis/http'

const route = useRoute()

const videoZone = route.params.zone as string
const keyword = route.query.keyword as string

console.log('videoZone: %s, keyword: %s', videoZone, keyword)

onMounted(async () => {
    await get('/x/web-interface/wbi/search/all/v2', { keyword }).then((res) => {
        console.log(res)
    })
})
</script>

<template>
    <h1>Search</h1>
</template>
