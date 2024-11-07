<script setup lang="ts"></script>

<template>
    <v-app>
        <app-bar></app-bar>

        <side-bar></side-bar>

        <v-main>
            <router-view v-slot="{ Component }">
                <transition name="fade">
                    <component :is="Component" />
                </transition>
            </router-view>
        </v-main>
    </v-app>
</template>

<style scoped></style>
