<script setup lang="ts">
import { fetchSearchDefault } from '@/apis/search/hot'
import { fetchSearchSuggest } from '@/apis/search/search'
import { Tag } from '@/apis/types/search'

const router = useRouter()

const searchKeyword = ref('')
const placeholder = ref('')
const loading = ref(false)

const sugggestList: Ref<Tag[]> = ref<Tag[]>([])

const searchInputRef = useTemplateRef<HTMLElement>('searchInput')

const toSearch = (keyword: string, zone: string = 'all') => {
    // FIXME: 手动移除焦点无效
    // 移除焦点
    searchInputRef.value?.blur()
    router.push({ name: 'Search', params: { zone }, query: { keyword } })
}

const getSearchSuggest = async () => {
    if (!searchKeyword.value) {
        sugggestList.value = []
        return
    }
    loading.value = true
    await fetchSearchSuggest({ term: searchKeyword.value })
        .then((res) => {
            sugggestList.value = res.tag
        })
        .finally(() => {
            loading.value = false
        })
}

const acceptSuggest = (keyword: string) => {
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
    <v-menu transition="slide-y-transition" :open-on-focus="true">
        <template v-slot:activator="{ props }"
            ><v-text-field
                ref="searchInput"
                v-bind="props"
                v-model="searchKeyword"
                :placeholder="placeholder"
                :loading="loading"
                append-inner-icon="mdi-chevron-right"
                clear-icon="mdi-close-circle"
                type="text"
                variant="solo"
                density="compact"
                width="150px"
                class="text-truncate"
                clearable
                hide-details
                single-line
                @focus="getSearchSuggest"
                @update:modelValue="getSearchSuggest"
                @keydown.enter="
                    acceptSuggest(searchKeyword ? searchKeyword : placeholder)
                "
                @click:append-inner="
                    acceptSuggest(searchKeyword ? searchKeyword : placeholder)
                "
            >
            </v-text-field>
        </template>
        <v-list density="compact">
            <v-list-item v-if="sugggestList.length === 0" class="text-center"
                >暂无搜索历史</v-list-item
            >
            <v-list-item
                v-for="(item, index) in sugggestList"
                :key="index"
                :value="index"
                prepend-icon="mdi-magnify"
            >
                <span
                    v-html="item.name"
                    @click.prevent="acceptSuggest(item.value)"
                ></span>
            </v-list-item>
        </v-list>
    </v-menu>
</template>
