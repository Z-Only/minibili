<script setup lang="ts">
import { fetchLiveArea } from '@/apis/live/live_area'
import { LiveAreaData, LiveRoomInfo } from '@/apis/types/live'
import { fetchLiveRoomListData } from '@/apis/live/live'
import { ShallowRef } from 'vue'
import { getDataGridSlice, getRealIndex } from '@/common/utils'
import { useGoTo } from 'vuetify'

const liveAreaList: Ref<LiveAreaData[]> = ref([])

const tab = ref(0)

const subTab = ref('')

const liveRoomInfoList: ShallowRef<LiveRoomInfo[]> = shallowRef([])

const colCount = ref(2)

const getLiveRoomListData = async (parentAreaId: number, areaId: string) => {
    await fetchLiveRoomListData({
        parent_area_id: parentAreaId.toString(),
        area_id: areaId,
        page: '1',
        platform: 'web',
    }).then((res) => {
        liveRoomInfoList.value = res.list
    })
}

const goTo = useGoTo()
const gotoTop = () => {
    goTo(0, { container: '#goto-container' })
}

onMounted(async () => {
    await fetchLiveArea().then((res) => {
        liveAreaList.value = res
        tab.value = liveAreaList.value[0].id
        subTab.value = liveAreaList.value[0].list[0].id

        getLiveRoomListData(tab.value, subTab.value)
    })
})
</script>

<template>
    <!-- FIXME: tab 区域宽度不固定 -->
    <v-sheet
        class="d-flex flex-row overflow-y-auto"
        style="height: calc(100vh - 64px)"
    >
        <v-tabs v-model="tab" direction="vertical">
            <v-tab
                v-for="area in liveAreaList"
                :key="area.id"
                :text="area.name"
                :value="area.id"
                max-width="150px"
                class="text-truncate"
            ></v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
            <v-tabs-window-item
                v-for="area in liveAreaList"
                :key="area.id"
                :value="area.id"
            >
                <v-sheet
                    class="d-flex flex-row overflow-y-auto"
                    style="height: calc(100vh - 64px)"
                >
                    <v-tabs v-model="subTab" direction="vertical">
                        <v-tab
                            v-for="subArea in area.list"
                            :key="subArea.id"
                            :text="subArea.name"
                            :value="subArea.id"
                            max-width="150px"
                            class="text-truncate"
                            @click.prevent="
                                getLiveRoomListData(area.id, subArea.id)
                            "
                        ></v-tab>
                    </v-tabs>

                    <v-tabs-window v-model="subTab">
                        <v-tabs-window-item
                            v-for="subArea in area.list"
                            :key="subArea.id"
                            :value="subArea.id"
                        >
                            <v-layout style="height: calc(100vh - 64px)">
                                <v-infinite-scroll
                                    :items="liveRoomInfoList"
                                    id="goto-container"
                                >
                                    <template
                                        v-for="n in Math.round(
                                            liveRoomInfoList.length / colCount
                                        )"
                                        :key="n"
                                        ><v-row no-gutters>
                                            <v-col
                                                v-for="(
                                                    item, i
                                                ) in getDataGridSlice(
                                                    liveRoomInfoList,
                                                    n - 1,
                                                    colCount
                                                )"
                                                :key="i"
                                                cols="12"
                                                :sm="Math.round(12 / colCount)"
                                            >
                                                <v-skeleton-loader
                                                    :loading="
                                                        getRealIndex(
                                                            n - 1,
                                                            colCount,
                                                            i
                                                        ) >=
                                                        liveRoomInfoList.length
                                                    "
                                                    type="card-avatar, actions"
                                                >
                                                    <v-responsive
                                                        ><v-sheet
                                                            class="ma-2 pa-2"
                                                            ><live-room-card
                                                                :info="item"
                                                            ></live-room-card></v-sheet
                                                    ></v-responsive>
                                                </v-skeleton-loader>
                                            </v-col> </v-row
                                    ></template>
                                </v-infinite-scroll>
                                <v-fab
                                    icon="mdi-chevron-double-up"
                                    location="bottom end"
                                    absolute
                                    @click="gotoTop"
                                ></v-fab>
                            </v-layout>
                        </v-tabs-window-item>
                    </v-tabs-window>
                </v-sheet>
            </v-tabs-window-item>
        </v-tabs-window>
    </v-sheet>
</template>
