<script setup lang="ts">
import { useTheme } from 'vuetify'
import { useLocale } from 'vuetify'
import { Store } from '@tauri-apps/plugin-store'

const router = useRouter()

const theme = useTheme()

const { current } = useLocale()

// Store 会在 JavaScript 绑定时自动加载
const store = new Store('settings.json')

const backDisabled = ref(true)
const forwardDisabled = ref(true)

const updateArrowDisabled = () => {
    backDisabled.value = router.options.history.state.back == null
    forwardDisabled.value = router.options.history.state.forward == null
}

const darkEnabled = ref(false)

// 切换主题
const toggleColorScheme = async () => {
    darkEnabled.value = !darkEnabled.value
    theme.global.name.value = darkEnabled.value ? 'dark' : 'light'
    await store.set('theme', darkEnabled.value ? 'dark' : 'light')
}

const localeList = [
    {
        name: '简体中文',
        locale: 'zh-Hans',
        language: ['zh', 'zh-CN', 'zh-Hans'],
    },
    { name: 'English', locale: 'en', language: ['en'] },
    { name: '日本語', locale: 'ja', language: ['ja'] },
    { name: '한국어', locale: 'ko', language: ['ko'] },
]

const curLocale = ref('')

const getLocaleName = () => {
    return (
        localeList.find((item) => item.locale === curLocale.value)?.name ||
        'zh-Hans'
    )
}

const matchLocaleForLanguage = (language: string) => {
    return (
        localeList.find((item) => item.language.includes(language))?.locale ||
        'zh-Hans'
    )
}

const updateLocale = async (locale: string) => {
    // 如果设置无效，使用系统语言
    if (!locale) {
        const systemLanguage = navigator.language || navigator.userLanguage
        console.log('system language', systemLanguage)
        locale = matchLocaleForLanguage(systemLanguage)
    }
    curLocale.value = locale
    current.value = curLocale.value
    await store.set('locale', curLocale.value)
}

onMounted(async () => {
    // 启动时自动加载设置，优先级: 用户设置 > 系统设置
    await store.get('theme').then(async (theme) => {
        console.log('store theme: ', theme)
        if (theme === 'system') {
            // 系统设置转换为主题
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
        }
        console.log('theme: ', theme)
        if ((theme === 'dark') !== darkEnabled.value) {
            await toggleColorScheme()
        }
    })
    await store.get('locale').then(async (locale) => {
        console.log('store locale: ', locale)
        await updateLocale(locale)
    })
})

// 监听路由变化，更新箭头状态
watch(
    router.options.history.state,
    () => {
        updateArrowDisabled()
    },
    { immediate: true, deep: true }
)

// 监听系统主题变化，如果用户设置为跟随系统，则自动切换主题
watch(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    async () => {
        await store.get('theme').then(async (theme) => {
            if (theme !== 'system') {
                return
            }
            if ((theme === 'dark') !== darkEnabled.value) {
                await toggleColorScheme()
            }
        })
    },
    { immediate: true }
)
</script>

<template>
    <v-responsive class="border rounded" max-height="3000">
        <v-app :theme="theme">
            <v-app-bar title="MiniBili" class="px-3">
                <v-btn
                    icon="mdi-arrow-left"
                    :disabled="backDisabled"
                    @click.prevent="router.back()"
                ></v-btn>
                <v-btn
                    icon="mdi-arrow-right"
                    :disabled="forwardDisabled"
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
                                    @click="updateLocale(item.locale)"
                                    >{{ item.name }}</v-btn
                                ></v-list-item-title
                            >
                        </v-list-item>
                    </v-list></v-menu
                >

                <v-tooltip
                    location="bottom"
                    :text="darkEnabled ? 'Toggle on light' : 'Toggle on night'"
                >
                    <template v-slot:activator="{ props }">
                        <v-btn
                            v-bind="props"
                            :icon="
                                darkEnabled
                                    ? 'mdi-weather-night'
                                    : 'mdi-weather-sunny'
                            "
                            @click="toggleColorScheme"
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
