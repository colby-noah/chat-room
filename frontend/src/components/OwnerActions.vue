<template>
    <div style="display: flex; flex-direction: column">
        <button
            class="button-gray action"
            @click="router.push('/promote-user')"
        >
            Promote User
        </button>
        <button
            class="button-gray action"
            @click="router.push('/demote-admin')"
        >
            Demote Admin
        </button>
        <button class="button-gray action" @click="router.push('/delete-room')">
            Delete Room
        </button>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<style scoped>
.action {
    margin-top: 40px;
    font-size: 18pt;
    min-width: 180px;
    min-height: 50px;
}
</style>
