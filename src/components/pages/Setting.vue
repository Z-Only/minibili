<script setup lang="ts">
import { openDevTools } from '@/service/commands'
import { useThemeStore } from '@/store/theme'
import { useLocaleStore } from '@/store/locale'

const themeStore = useThemeStore()
const localeStore = useLocaleStore()

const enableSystemTheme = ref(themeStore.isAuto.value)
const enableSystemLocale = ref(localeStore.isAuto.value)

themeStore.$subscribe((_mutation, state) => {
    enableSystemTheme.value = state.theme.value === 'auto'
})
localeStore.$subscribe((_mutation, state) => {
    enableSystemLocale.value = state.locale.value === 'auto'
})

watch(enableSystemTheme, async (value) => {
    if (value) {
        await themeStore.setTheme('auto')
    }
})
watch(enableSystemLocale, async (value) => {
    if (value) {
        await localeStore.setLocale('auto')
    }
})

onMounted(async () => {})
</script>

<template>
    <v-sheet class="d-flex flex-column justify-start align-center">
        <v-img width="150" cover src="/icon.png" alt="LOGO"></v-img>
        <v-card class="mx-auto" width="600">
            <v-list>
                <v-list-subheader>系统设置</v-list-subheader>

                <v-list-item title="深色跟随系统">
                    <template v-slot:append>
                        <v-switch v-model="enableSystemTheme"></v-switch>
                    </template>
                </v-list-item>

                <v-list-item title="跟随系统语言">
                    <template v-slot:append>
                        <v-switch v-model="enableSystemLocale"></v-switch>
                    </template>
                </v-list-item>

                <v-list-item title="开发者工具">
                    <template v-slot:append>
                        <v-btn
                            icon="mdi-greater-than"
                            variant="text"
                            @click.prevent="openDevTools"
                        ></v-btn>
                    </template>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-subheader>其它设置</v-list-subheader>

                <v-list-item title="用户协议">
                    <template v-slot:append>
                        <v-btn icon="mdi-greater-than" variant="text"></v-btn>
                    </template>
                </v-list-item>
                <v-list-item title="隐私政策">
                    <template v-slot:append>
                        <v-btn icon="mdi-greater-than" variant="text"></v-btn>
                    </template>
                </v-list-item>
            </v-list>
        </v-card>
    </v-sheet>
</template>

<style scoped></style>
