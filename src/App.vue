<script setup lang="ts"></script>

<template>
    <v-responsive class="border rounded" max-height="3000">
        <v-app>
            <app-bar></app-bar>

            <side-bar></side-bar>

            <v-main>
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
