<script setup lang="ts">
const router = useRouter()

const toHome = () => {
    router.push({ name: 'Home' })
}

const toSetting = () => {
    router.push({ name: 'Setting' })
}
</script>

<template>
    <v-navigation-drawer :rail="true" permanent>
        <v-list density="compact" nav color="primary" rounded="xl">
            <v-list-item
                prepend-icon="mdi-home-outline"
                title="Home"
                value="home"
                @click.prevent="toHome"
                ><v-list-item-title>主页</v-list-item-title></v-list-item
            >
            <v-list-item
                prepend-icon="mdi-cog"
                title="Setting"
                value="setting"
                @click.prevent="toSetting"
                ><v-list-item-title>设置</v-list-item-title></v-list-item
            >
        </v-list>
    </v-navigation-drawer>
</template>
