<script setup lang="ts">
import { fetchSearchDefault } from '@/apis/search/hot'
import { fetchSearchSuggest } from '@/apis/search/search'
import { Tag } from '@/apis/types/search'

const router = useRouter()

const searchKeyword = ref('')
const placeholder = ref('')
const loading = ref(false)

const sugggestList: Ref<Tag[]> = ref<Tag[]>([])

const toSearch = (keyword: string, zone: string = 'all') => {
    router.push({ name: 'Search', params: { zone }, query: { keyword } })
}

const getSearchSuggest = async () => {
    if (searchKeyword.value === '') {
        sugggestList.value = []
        return
    }
    loading.value = true
    await fetchSearchSuggest({ term: searchKeyword.value })
        .then((res) => {
            console.log('suggest', res)
            sugggestList.value = res.tag
        })
        .finally(() => {
            loading.value = false
        })
}

const clickSuggest = (keyword: string) => {
    searchKeyword.value = keyword
    toSearch(keyword)
}

onMounted(async () => {
    // 默认搜索词
    await fetchSearchDefault().then((res) => {
        placeholder.value = res.show_name
    })
})
</script>

<template>
    <v-menu>
        <template v-slot:activator="{ props }"
            ><v-text-field
                v-bind="props"
                v-model="searchKeyword"
                :placeholder="placeholder"
                :loading="loading"
                @input="getSearchSuggest"
                @blur="sugggestList = []"
                append-inner-icon="mdi-magnify"
                clear-icon="mdi-close-circle"
                type="text"
                variant="solo"
                density="compact"
                width="150px"
                class="text-truncate"
                clearable
                hide-details
                single-line
                @click:append-inner="
                    toSearch(searchKeyword ? searchKeyword : placeholder)
                "
            />
        </template>
        <v-list>
            <v-list-item v-if="sugggestList.length === 0" class="text-center"
                >暂无搜索历史</v-list-item
            >
            <v-list-item
                v-for="(item, index) in sugggestList"
                :key="index"
                :value="index"
                prepend-icon="mdi-magnify"
            >
                <v-list-item-title @click.prevent="clickSuggest(item.value)">{{
                    item.value
                }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>
