<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLocale } from 'vuetify'

// TODO: 启动时自动加载主题设置
const theme = ref('light')

const router = useRouter()

const { current } = useLocale()

const backDisabled = () => {
    return router.options.history.state.back == null
}

const forwardDisabled = () => {
    return router.options.history.state.forward == null
}

const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const localeList = [
    { name: '简体中文', locale: 'zh-Hans' },
    { name: 'English', locale: 'en' },
    { name: '日本語', locale: 'ja' },
    { name: '한국어', locale: 'ko' },
]

const changeLocale = (locale: string) => {
    current.value = locale
}

const getLocaleName = () => {
    return localeList.find((item) => item.locale === current.value)?.name
}

onMounted(() => {
    // 默认语言
    current.value = 'zh-Hans'
})
</script>

<template>
    <v-responsive class="border rounded" max-height="3000">
        <v-app :theme="theme">
            <v-app-bar title="MiniBili" class="px-3">
                <v-btn
                    icon="mdi-arrow-left"
                    :disabled="backDisabled()"
                    @click.prevent="router.back()"
                ></v-btn>
                <v-btn
                    icon="mdi-arrow-right"
                    :disabled="forwardDisabled()"
                    @click.prevent="router.forward()"
                ></v-btn>
                <v-btn icon="mdi-refresh" @click.prevent="router.go(0)"></v-btn>
                <v-btn
                    icon="mdi-home-outline"
                    @click.prevent="router.push({ name: 'Home' })"
                ></v-btn>
                <v-spacer></v-spacer>
                <v-menu open-on-hover>
                    <template v-slot:activator="{ props }"
                        ><v-btn v-bind="props" prepend-icon="mdi-translate">{{
                            getLocaleName()
                        }}</v-btn></template
                    ><v-list>
                        <v-list-item
                            v-for="(item, index) in localeList"
                            :key="index"
                        >
                            <v-list-item-title>
                                <v-btn
                                    variant="plain"
                                    @click="changeLocale(item.locale)"
                                    >{{ item.name }}</v-btn
                                ></v-list-item-title
                            >
                        </v-list-item>
                    </v-list></v-menu
                >

                <v-tooltip
                    location="bottom"
                    :text="
                        theme === 'light'
                            ? 'Toggle on night'
                            : 'Toggle on light'
                    "
                >
                    <template v-slot:activator="{ props }">
                        <v-btn
                            v-bind="props"
                            :icon="
                                theme === 'light'
                                    ? 'mdi-weather-sunny'
                                    : 'mdi-weather-night'
                            "
                            @click="toggleTheme"
                        ></v-btn>
                    </template>
                </v-tooltip>
            </v-app-bar>

            <v-navigation-drawer>
                <v-list>
                    <v-list-item title="Navigation drawer"></v-list-item>
                </v-list>
            </v-navigation-drawer>

            <v-main>
                <v-container>
                    <router-view />
                </v-container>
            </v-main>
        </v-app>
    </v-responsive>
</template>

<style scoped></style>
