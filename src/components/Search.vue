<script setup lang="ts">
import { fetchSearchAll } from '@/apis/search/all'

const route = useRoute()

const videoZone = route.params.zone as string
const keyword = route.query.keyword as string

console.log('videoZone: %s, keyword: %s', videoZone, keyword)

onMounted(async () => {
    await fetchSearchAll({ keyword }).then((res) => {
        console.log(res)
    })
})
</script>

<template>
    <h1>Search</h1>
</template>
