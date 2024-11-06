<script setup lang="ts">
const tab = ref('tab-recommend')

interface VTabItem {
    icon: string
    text: string
    value: string
}

const rankingTabs: Ref<VTabItem[]> = ref([
    {
        icon: 'mdi-animation',
        text: '动画',
        value: 'tab-douga',
    },
    {
        icon: 'mdi-fan-clock',
        text: '番剧',
        value: 'tab-anime',
    },
    {
        icon: 'mdi-waves',
        text: '国创',
        value: 'tab-guochuang',
    },
    {
        icon: 'mdi-music',
        text: '音乐',
        value: 'tab-music',
    },
    {
        icon: 'mdi-dance-pole',
        text: '舞蹈',
        value: 'tab-dance',
    },
    {
        icon: 'mdi-gamepad',
        text: '游戏',
        value: 'tab-game',
    },
    {
        icon: 'mdi-owl',
        text: '知识',
        value: 'tab-knowledge',
    },
    {
        icon: 'mdi-flashlight',
        text: '科技',
        value: 'tab-tech',
    },
    {
        icon: 'mdi-lifebuoy',
        text: '运动',
        value: 'tab-sports',
    },
    {
        icon: 'mdi-car',
        text: '汽车',
        value: 'tab-car',
    },
    {
        icon: 'mdi-duck',
        text: '生活',
        value: 'tab-life',
    },
    {
        icon: 'mdi-food',
        text: '美食',
        value: 'tab-food',
    },
    {
        icon: 'mdi-panda',
        text: '动物圈',
        value: 'tab-animal',
    },
    {
        icon: 'mdi-chess-king',
        text: '鬼畜',
        value: 'tab-kichiku',
    },
    {
        icon: 'mdi-tshirt-v',
        text: '时尚',
        value: 'tab-fashion',
    },
    {
        icon: 'mdi-mushroom',
        text: '娱乐',
        value: 'tab-ent',
    },
    {
        icon: 'mdi-theater',
        text: '影视',
        value: 'tab-cinephile',
    },
    {
        icon: 'mdi-nature-people',
        text: '纪录片',
        value: 'tab-documentary',
    },
    {
        icon: 'mdi-movie',
        text: '电影',
        value: 'tab-movie',
    },
    {
        icon: 'mdi-television',
        text: '电视剧',
        value: 'tab-tv',
    },
])

const tabs: Ref<VTabItem[]> = ref([
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
        text: '排行榜',
        value: 'tab-ranking',
    },
    ...rankingTabs.value,
])

onMounted(async () => {})
</script>

<template>
    <!-- FIXME: 滚动条显示问题 -->
    <div class="d-flex flex-row">
        <v-tabs
            v-model="tab"
            :items="tabs"
            direction="vertical"
            align-tabs="center"
            color="white"
            height="60"
            slider-color="#f78166"
        >
            <template v-slot:tab="{ item }: { item: any }">
                <v-tab
                    :prepend-icon="item.icon"
                    :text="item.text"
                    :value="item.value"
                    class="text-none"
                ></v-tab>
            </template>

            <template v-slot:item="{ item }: { item: any }">
                <v-tabs-window-item :value="item.value" class="pa-4">
                    <recommend
                        v-if="item.value === 'tab-recommend'"
                    ></recommend>
                    <popular v-else-if="item.value === 'tab-hot'"></popular>
                    <popular-precious
                        v-else-if="item.value === 'tab-precious'"
                    ></popular-precious>
                    <popular-series
                        v-else-if="item.value === 'tab-must-see'"
                    ></popular-series>
                </v-tabs-window-item>
            </template>
        </v-tabs>
    </div>
</template>

<style scoped></style>
