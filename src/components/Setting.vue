<script setup lang="ts">
import { openDevTools } from '@/service/commands'
import { setStoreTheme, getStoreTheme } from '@/service/tauri-store'

const enableSystemTheme = ref(false)

// FIXME: 需要全局状态管理
watchEffect(async () => {
    if (enableSystemTheme.value) {
        await setStoreTheme('system')
    } else {
        await setStoreTheme('light')
    }
})

onMounted(async () => {
    enableSystemTheme.value = (await getStoreTheme()) === 'system'
})
</script>

<template>
    <v-container class="d-flex flex-column justify-start align-center">
        <v-img width="200" cover src="/icon.png" alt="LOGO"></v-img>
        <v-card class="mx-auto" width="600">
            <v-list>
                <v-list-subheader>系统设置</v-list-subheader>

                <v-list-item title="深色跟随系统">
                    <template v-slot:append>
                        <v-switch v-model="enableSystemTheme"></v-switch>
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
    </v-container>
</template>

<style scoped></style>
