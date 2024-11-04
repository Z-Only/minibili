<script setup lang="ts"></script>

<template>
    <v-responsive class="border rounded">
        <v-app>
            <app-bar></app-bar>

            <side-bar></side-bar>

            <v-main class="overflow-y-auto">
                <v-container>
                    <router-view v-slot="{ Component }">
                        <transition name="fade">
                            <component :is="Component" />
                        </transition>
                    </router-view>
                </v-container>
            </v-main>
        </v-app>
    </v-responsive>
</template>

<style scoped></style>
