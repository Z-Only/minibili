import { defineStore } from 'pinia'
import { setStoreTheme, getStoreTheme } from '@/service/tauri-store'

export type Theme = 'auto' | 'light' | 'dark'

const themes: Theme[] = ['light', 'dark', 'auto']

const isTheme = (value: string): value is Theme => {
    return themes.includes(value as Theme)
}

export const useThemeStore = defineStore('theme', () => {
    const theme: Ref<Theme> = ref('auto')

    const isAuto = computed(() => theme.value === 'auto')

    const getTheme = async () => {
        const storeTheme = await getStoreTheme()
        if (storeTheme && isTheme(storeTheme)) {
            theme.value = storeTheme
        } else {
            setTheme('auto')
        }

        return theme.value
    }

    const setTheme = async (config: Theme) => {
        theme.value = config
        setStoreTheme(config)
    }

    return { theme, isAuto, getTheme, setTheme }
})
