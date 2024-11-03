import { defineStore } from 'pinia'
import { setStoreLocale, getStoreLocale } from '@/service/tauri-store'

export type Locale = 'auto' | 'zh-Hans' | 'en' | 'ja' | 'ko'

const Locales: Locale[] = ['auto', 'zh-Hans', 'en', 'ja', 'ko']

const isLocale = (value: string): value is Locale => {
    return Locales.includes(value as Locale)
}

export const useLocaleStore = defineStore('Locale', () => {
    const locale: Ref<Locale> = ref('auto')

    const isAuto = computed(() => locale.value === 'auto')

    const getLocale = async () => {
        const storeLocale = await getStoreLocale()
        if (storeLocale && isLocale(storeLocale)) {
            locale.value = storeLocale
        } else {
            setLocale('auto')
        }

        return locale.value
    }

    const setLocale = async (config: Locale) => {
        locale.value = config
        setStoreLocale(config)
    }

    return { locale, isAuto, getLocale, setLocale }
})
