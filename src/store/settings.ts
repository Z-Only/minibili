import { Store } from '@tauri-apps/plugin-store'

const store = new Store('settings.json')

export const setStoreTheme = async (value: string) =>
    await store.set('theme', value)

export const getStoreTheme = async (): Promise<string | null> =>
    await store.get('theme')

export const setStoreLocale = async (value: string) =>
    await store.set('locale', value)

export const getStoreLocale = async (): Promise<string | null> =>
    await store.get('locale')
