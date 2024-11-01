import { Store } from '@tauri-apps/plugin-store'

let store: Store
const initStore = async () => {
    if (!store) {
        console.log('store init')
        store = await Store.load('settings.json')
    }
}

type StoreValueType = string | null | undefined

export const setStoreTheme = async (value: string) => {
    await initStore()
    return await store.set('theme', value)
}

export const getStoreTheme = async (): Promise<StoreValueType> => {
    await initStore()
    return await store.get('theme')
}

export const setStoreLocale = async (value: string) => {
    await initStore()
    return await store.set('locale', value)
}

export const getStoreLocale = async (): Promise<StoreValueType> => {
    await initStore()
    return await store.get('locale')
}

export const setStoreDownloadPath = async (value: string) => {
    await initStore()
    return await store.set('download_path', value)
}

export const getStoreDownloadPath = async (): Promise<StoreValueType> => {
    await initStore()
    return await store.get('download_path')
}
