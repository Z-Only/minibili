<script setup lang="ts">
import Cookies from 'js-cookie'
import { invoke } from '@tauri-apps/api/core'

const route = useRoute()

const videoZone = route.params.zone as string
const keyword = route.query.keyword as string

console.log('videoZone: %s, keyword: %s', videoZone, keyword)

onMounted(async () => {
    console.log('Cookies: %s', Cookies.get('buvid3'))
    await invoke('get_cookie').then((cookie) => {
        console.log('Cookie: %s', cookie)
    })
})
</script>

<template>
    <h1>Search</h1>
</template>
