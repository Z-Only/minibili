<script setup lang="ts">
import { useTheme } from 'vuetify'
import { useLocale } from 'vuetify'
import {
    setStoreTheme,
    setStoreLocale,
    getStoreTheme,
    getStoreLocale,
} from '@/service/tauri-store'

const router = useRouter()
const route = useRoute()

const vuetifyTheme = useTheme()

const { current } = useLocale()

const searchBarPlaceholder = ref('搜索')
const searchLoading = ref(false)

const toSearch = (keyword: string, zone: string = 'all') => {
    router.push({ name: 'Search', params: { zone }, query: { keyword } })
}

const toLogin = () => {
    router.push({ name: 'Login' })
}

const toHome = () => {
    router.push({ name: 'Home' })
}

const toSetting = () => {
    router.push({ name: 'Setting' })
}

const backDisabled = ref(true)
const forwardDisabled = ref(true)

const updateArrowDisabled = () => {
    backDisabled.value = router.options.history.state.back == null
    forwardDisabled.value = router.options.history.state.forward == null
}

const darkEnabled = ref(false)

const toggleColorScheme = async (useSystemTheme: boolean = true) => {
    darkEnabled.value = !darkEnabled.value
    vuetifyTheme.global.name.value = darkEnabled.value ? 'dark' : 'light'
    if (useSystemTheme) {
        await setStoreTheme('system')
    } else {
        await setStoreTheme(darkEnabled.value ? 'dark' : 'light')
    }
}

const localeList = [
    {
        name: '简体中文',
        locale: 'zh-Hans',
        languages: ['zh', 'zh-CN', 'zh-Hans'],
    },
    { name: 'English', locale: 'en', languages: ['en', 'en-US', 'en-UK'] },
    { name: '日本語', locale: 'ja', languages: ['ja'] },
    { name: '한국어', locale: 'ko', languages: ['ko'] },
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
        localeList.find((item) => item.languages.includes(language))?.locale ||
        'zh-Hans'
    )
}

const updateLocale = async (locale: string) => {
    if (!locale) {
        const systemLanguage = navigator.language
        console.log('system language:', systemLanguage)
        locale = matchLocaleForLanguage(systemLanguage)
    }
    curLocale.value = locale
    current.value = curLocale.value
    await setStoreLocale(curLocale.value)
}

onMounted(async () => {
    await getStoreTheme().then(async (storedTheme) => {
        if (!storedTheme) {
            storedTheme = 'system'
            await setStoreTheme(storedTheme)
        }
        console.log('store theme:', storedTheme)
        let currentTheme = storedTheme
        if (storedTheme === 'system') {
            currentTheme = window.matchMedia('(prefers-color-scheme: dark)')
                .matches
                ? 'dark'
                : 'light'
        }
        console.log('current theme:', currentTheme)
        if ((currentTheme === 'dark') !== darkEnabled.value) {
            await toggleColorScheme(storedTheme === 'system')
        }
    })

    await getStoreLocale().then(async (storedLocale) => {
        console.log('store locale:', storedLocale)
        await updateLocale(storedLocale as string)
    })
})

watch(
    ref(window.matchMedia('(prefers-color-scheme: dark)').matches),
    async () => {
        await getStoreTheme().then(async (storedTheme) => {
            if (storedTheme !== 'system') {
                return
            }
            const currentTheme = window.matchMedia(
                '(prefers-color-scheme: dark)'
            ).matches
                ? 'dark'
                : 'light'
            if ((currentTheme === 'dark') !== darkEnabled.value) {
                await toggleColorScheme()
            }
        })
    },
    { immediate: true }
)

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
    <v-responsive class="border rounded" max-height="3000">
        <v-app>
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
                        <v-btn v-bind="props" prepend-icon="mdi-translate">{{
                            getLocaleName()
                        }}</v-btn>
                    </template>
                    <v-list>
                        <v-list-item
                            v-for="(item, index) in localeList"
                            :key="index"
                        >
                            <v-list-item-title>
                                <v-btn
                                    variant="plain"
                                    @click="updateLocale(item.locale)"
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
                                darkEnabled
                                    ? 'mdi-weather-night'
                                    : 'mdi-weather-sunny'
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

            <v-navigation-drawer :rail="true" permanent>
                <v-list density="compact" nav color="primary" rounded="xl">
                    <v-list-item
                        prepend-icon="mdi-home-outline"
                        title="Home"
                        value="home"
                        @click.prevent="toHome"
                        ><v-list-item-title
                            >主页</v-list-item-title
                        ></v-list-item
                    >
                    <v-list-item
                        prepend-icon="mdi-cog"
                        title="Setting"
                        value="setting"
                        @click.prevent="toSetting"
                        ><v-list-item-title
                            >设置</v-list-item-title
                        ></v-list-item
                    >
                </v-list>
            </v-navigation-drawer>

            <v-main>
                <v-container>
                    <router-view v-slot="{ Component }">
                        <transition name="fade">
                            <component :is="Component" />
                        </transition>
                    </router-view>
                </v-container>
            </v-main>
        </v-app>
    </v-responsive>
</template>

<style scoped></style>
