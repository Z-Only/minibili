<script setup lang="ts">
import { DanmuInfo } from '@/apis/types/live-msg-stream'

// 定义 props 并设置默认值
withDefaults(
    defineProps<{
        danmus: DanmuInfo[]
    }>(),
    {
        danmus: () => [],
    }
)
</script>

<template>
    <v-layout height="300px">
        <v-infinite-scroll mode="manual" :items="danmus">
            <template v-for="item in danmus" :key="item">
                <div>
                    {{ item.content }}
                </div>
            </template>
            <template v-slot:load-more="{ props }">
                <v-btn
                    icon="mdi-refresh"
                    size="small"
                    variant="text"
                    v-bind="props"
                ></v-btn>
            </template>
        </v-infinite-scroll>
    </v-layout>
</template>
