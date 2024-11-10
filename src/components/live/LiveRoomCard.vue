<script setup lang="ts">
import { LiveRoomInfo } from '@/apis/types/live'

const { info } = defineProps<{
    info: LiveRoomInfo
}>()
</script>

<template>
    <v-card
        ><v-img
            class="align-end text-white"
            :src="info.cover"
            :aspect-ratio="4 / 3"
            lazy-src="https://i0.hdslb.com/bfs/archive/c8fd97a40bf79f03e7b76cbc87236f612caef7b2.png"
            cover
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            >{{ info.area_name }}</v-img
        >
        <v-card-actions>
            <div class="d-flex align-center">
                <v-avatar size="36">
                    <v-img :alt="info.uname" :src="info.face"></v-img>
                </v-avatar>
                <!-- 作者名和发布时间 -->
                <div class="text-truncate mx-auto">
                    <div>{{ info.title }}</div>
                    <div>
                        {{ info.uname
                        }}<span
                            ><v-icon icon="mdi-eye"></v-icon>
                            {{ info.watched_show.num }}</span
                        >
                    </div>
                </div>
            </div>
        </v-card-actions>
    </v-card>
</template>
