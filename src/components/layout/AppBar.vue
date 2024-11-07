<script setup lang="ts">
import { useTheme } from 'vuetify'
import { useLocale } from 'vuetify'
import { Theme, useThemeStore } from '@/store/theme'
import { useLocaleStore, Locale } from '@/store/locale'
import { fetchSearchDefault } from '@/apis/search/hot'

const router = useRouter()
const route = useRoute()

const backDisabled = ref(true)
const forwardDisabled = ref(true)

const themeStore = useThemeStore()
const vuetifyTheme = useTheme()
// 记录 vuetify 主题是否为 dark
const darkEnabled = ref(false)

const localeStore = useLocaleStore()
const { current: vuetifyLocale } = useLocale()
const curLocale: Ref<Locale> = ref('zh-Hans')

const searchBarPlaceholder = ref('')
const searchLoading = ref(false)

const toSearch = (keyword: string, zone: string = 'all') => {
    router.push({ name: 'Search', params: { zone }, query: { keyword } })
}

const toLogin = () => {
    router.push({ name: 'Login' })
}

const updateArrowDisabled = () => {
    backDisabled.value = router.options.history.state.back == null
    forwardDisabled.value = router.options.history.state.forward == null
}

themeStore.$subscribe((_mutation, state) => {
    // 每当状态发生变化时，改变主题。
    changeDarkModeWithConfig(state.theme)
})

const changeDarkModeWithConfig = (theme: Theme) => {
    if (theme === 'auto') {
        darkEnabled.value = window.matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches
    } else {
        darkEnabled.value = theme === 'dark'
    }
    vuetifyTheme.global.name.value = darkEnabled.value ? 'dark' : 'light'
}

const toggleColorScheme = async () => {
    darkEnabled.value = !darkEnabled.value
    vuetifyTheme.global.name.value = darkEnabled.value ? 'dark' : 'light'
    themeStore.setTheme(darkEnabled.value ? 'dark' : 'light')
}

interface LocaleItem {
    name: string
    locale: Locale
    languages: string[]
}

const localeList: LocaleItem[] = [
    {
        name: '简体中文',
        locale: 'zh-Hans',
        languages: ['zh', 'zh-CN', 'zh-Hans'],
    },
    { name: 'English', locale: 'en', languages: ['en', 'en-US', 'en-UK'] },
    { name: '日本語', locale: 'ja', languages: ['ja'] },
    { name: '한국어', locale: 'ko', languages: ['ko'] },
]

const matchLocaleByLanguage = (language: string): Locale => {
    return (
        localeList.find((item) => item.languages.includes(language))?.locale ||
        'zh-Hans'
    )
}

localeStore.$subscribe((_mutation, state) => {
    // 每当状态发生变化时，改变主题。
    changeLocaleWithConfig(state.locale)
})

const changeLocaleWithConfig = async (locale: Locale) => {
    if (locale === 'auto') {
        curLocale.value = matchLocaleByLanguage(navigator.language)
    } else {
        curLocale.value = locale
    }
    vuetifyLocale.value = curLocale.value
}

const selectLocale = async (locale: Locale) => {
    curLocale.value = locale
    vuetifyLocale.value = curLocale.value
    localeStore.setLocale(curLocale.value)
}

onMounted(async () => {
    // 初始化主题
    const theme = await themeStore.getTheme()
    changeDarkModeWithConfig(theme)

    const locale = await localeStore.getLocale()
    changeLocaleWithConfig(locale)

    // 默认搜索词
    await fetchSearchDefault().then((res) => {
        searchBarPlaceholder.value = res.show_name
    })
})

// TODO: 没测试过，不知道是否有效
watch(
    ref(window.matchMedia('(prefers-color-scheme: dark)').matches),
    async () => {
        if (themeStore.isAuto) {
            changeDarkModeWithConfig('auto')
        }
    }
)
watch(ref(navigator.language), async () => {
    if (localeStore.isAuto) {
        changeLocaleWithConfig('auto')
    }
})

// 监听路由变化
watch(
    route,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_to, _from) => {
        updateArrowDisabled()
    },
    { immediate: true }
)
</script>

<template>
    <v-app-bar title="MiniBili" class="px-3">
        <v-btn
            icon="mdi-arrow-left"
            :disabled="backDisabled"
            @click.prevent="router.back()"
        />
        <v-btn
            icon="mdi-arrow-right"
            :disabled="forwardDisabled"
            @click.prevent="router.forward()"
        />
        <v-btn icon="mdi-refresh" @click.prevent="router.go(0)" />

        <v-spacer />

        <v-text-field
            v-model="searchBarPlaceholder"
            :loading="searchLoading"
            append-inner-icon="mdi-magnify"
            clear-icon="mdi-close-circle"
            type="text"
            label="Search templates"
            variant="solo"
            density="compact"
            clearable
            hide-details
            single-line
            @click:append-inner="toSearch(searchBarPlaceholder)"
        />

        <v-spacer />

        <v-menu open-on-hover>
            <template #activator="{ props }">
                <v-btn
                    v-bind="props"
                    prepend-icon="mdi-translate"
                    append-icon="mdi-chevron-down"
                ></v-btn>
            </template>
            <v-list>
                <v-list-item
                    v-for="(item, index) in localeList"
                    :key="index"
                    :active="curLocale === item.locale"
                >
                    <v-list-item-title>
                        <v-btn
                            variant="plain"
                            @click.prevent="selectLocale(item.locale)"
                        >
                            {{ item.name }}
                        </v-btn>
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-tooltip
            location="bottom"
            :text="darkEnabled ? 'Toggle on light' : 'Toggle on night'"
        >
            <template #activator="{ props }">
                <v-btn
                    v-bind="props"
                    :icon="
                        darkEnabled ? 'mdi-weather-night' : 'mdi-weather-sunny'
                    "
                    @click="toggleColorScheme"
                />
            </template>
        </v-tooltip>

        <v-avatar @click.prevent="toLogin">
            <v-img
                alt="akari"
                src="https://static.hdslb.com/images/akari.jpg"
            />
        </v-avatar>
    </v-app-bar>
</template>
