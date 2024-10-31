<script setup lang="ts">
import { openDevTools } from '@/common/commands'
</script>

<template>
    <v-card class="mx-auto" max-width="600">
        <v-list>
            <v-list-subheader>系统设置</v-list-subheader>

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
</template>

<style scoped></style>
