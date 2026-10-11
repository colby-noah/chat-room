<template>
    <div class="parent-container">
        <RouterView />
    </div>
</template>

<script setup>
import { RouterView } from "vue-router";
</script>

<style scoped>
.parent-container {
    display: flex;
    flex-direction: column;
}
</style>
