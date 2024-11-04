<script setup lang="ts">
import { fetchSpaceInfo } from '@/apis/user/info'
import { SpaceInfoData } from '@/apis/types/space-info'

const route = useRoute()
const mid = Number(route.params.mid as string)

console.log('mid:', mid)

const user: Ref<SpaceInfoData | null> = ref(null)

onMounted(async () => {
    user.value = await fetchSpaceInfo(mid)
})
</script>

<template>
    <div>
        <h1>Space</h1>
        <span>{{ mid }}</span>
    </div>
</template>
