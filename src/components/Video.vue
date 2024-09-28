<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const bvid = ref(route.params.bvid);
</script>

<template>
    {{ bvid }}
</template>