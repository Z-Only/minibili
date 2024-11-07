<script setup lang="ts">
interface TabItem {
    icon: string
    text: string
    value: string
    rid?: number
}

const baseTabs: Ref<TabItem[]> = ref([
    {
        icon: 'mdi-balloon',
        text: '推荐',
        value: 'tab-recommend',
    },
    {
        icon: 'mdi-gift-outline',
        text: '入站必刷',
        value: 'tab-precious',
    },
    { icon: 'mdi-fire', text: '热门', value: 'tab-hot' },
    {
        icon: 'mdi-television-classic',
        text: '每周必看',
        value: 'tab-must-see',
    },
    {
        icon: 'mdi-fan',
        text: '全站排行榜',
        value: 'tab-ranking',
    },
])

const partitionRankingTabs: Ref<TabItem[]> = ref([
    {
        icon: 'mdi-animation',
        text: '动画',
        value: 'tab-douga',
        rid: 1,
    },
    {
        icon: 'mdi-fan-clock',
        text: '番剧',
        value: 'tab-anime',
        rid: 13,
    },
    {
        icon: 'mdi-waves',
        text: '国创',
        value: 'tab-guochuang',
        rid: 167,
    },
    {
        icon: 'mdi-music',
        text: '音乐',
        value: 'tab-music',
        rid: 3,
    },
    {
        icon: 'mdi-dance-pole',
        text: '舞蹈',
        value: 'tab-dance',
        rid: 129,
    },
    {
        icon: 'mdi-gamepad',
        text: '游戏',
        value: 'tab-game',
        rid: 4,
    },
    {
        icon: 'mdi-owl',
        text: '知识',
        value: 'tab-knowledge',
        rid: 36,
    },
    {
        icon: 'mdi-flashlight',
        text: '科技',
        value: 'tab-tech',
        rid: 188,
    },
    {
        icon: 'mdi-lifebuoy',
        text: '运动',
        value: 'tab-sports',
        rid: 234,
    },
    {
        icon: 'mdi-car',
        text: '汽车',
        value: 'tab-car',
        rid: 223,
    },
    {
        icon: 'mdi-duck',
        text: '生活',
        value: 'tab-life',
        rid: 160,
    },
    {
        icon: 'mdi-food',
        text: '美食',
        value: 'tab-food',
        rid: 211,
    },
    {
        icon: 'mdi-panda',
        text: '动物圈',
        value: 'tab-animal',
        rid: 217,
    },
    {
        icon: 'mdi-chess-king',
        text: '鬼畜',
        value: 'tab-kichiku',
        rid: 119,
    },
    {
        icon: 'mdi-tshirt-v',
        text: '时尚',
        value: 'tab-fashion',
        rid: 155,
    },
    {
        icon: 'mdi-mushroom',
        text: '娱乐',
        value: 'tab-ent',
        rid: 5,
    },
    {
        icon: 'mdi-theater',
        text: '影视',
        value: 'tab-cinephile',
        rid: 181,
    },
    {
        icon: 'mdi-nature-people',
        text: '纪录片',
        value: 'tab-documentary',
        rid: 177,
    },
    {
        icon: 'mdi-movie',
        text: '电影',
        value: 'tab-movie',
        rid: 23,
    },
    {
        icon: 'mdi-television',
        text: '电视剧',
        value: 'tab-tv',
        rid: 11,
    },
])

const tabs: Ref<TabItem[]> = ref(baseTabs.value)

const tab = ref(tabs.value[0].value)

const addItem = (item: TabItem) => {
    tabs.value.push(item)
    nextTick(() => {
        tab.value = item.value
    })
    console.log(item)
}
</script>

<template>
    <!-- FIXME: 滚动条显示问题 -->
    <v-layout class="d-flex flex-row">
        <v-tabs v-model="tab" direction="vertical">
            <v-tab
                v-for="item in tabs"
                :prepend-icon="item.icon"
                :key="item.value"
                :text="item.text"
                :value="item.value"
            ></v-tab>

            <v-menu v-if="partitionRankingTabs.length">
                <template v-slot:activator="{ props }">
                    <v-btn
                        prepend-icon="mdi-party-popper"
                        append-icon="mdi-menu-down"
                        variant="plain"
                        v-bind="props"
                    >
                        分区排行榜
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item
                        v-for="item in partitionRankingTabs"
                        :key="item.value"
                        :title="item.text"
                        @click="addItem(item)"
                    ></v-list-item>
                </v-list>
            </v-menu>
        </v-tabs>

        <v-tabs-window v-model="tab">
            <v-tabs-window-item
                v-for="item in tabs"
                :key="item.value"
                :value="item.value"
            >
                <recommend v-if="item.value === 'tab-recommend'"></recommend>
                <popular v-else-if="item.value === 'tab-hot'"></popular>
                <popular-precious
                    v-else-if="item.value === 'tab-precious'"
                ></popular-precious>
                <popular-series
                    v-else-if="item.value === 'tab-must-see'"
                ></popular-series>
                <!-- 排行榜的入口 -->
                <ranking v-else :rid="item.rid"></ranking>
            </v-tabs-window-item>
        </v-tabs-window>
    </v-layout>
</template>

<style scoped></style>
