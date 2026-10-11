<template>
    <div class="flex-col-centered">
        <button class="button-gray back" @click="router.push('/room-options')">
            Back
        </button>
        <div class="action-container">
            <h1 style="color: var(--vue-green)">
                Are you sure you want to leave?
            </h1>
            <button class="button-gray submit" @click="leaveRoom()">
                Leave
            </button>
            <p
                v-if="result.message"
                :class="{ error: result.isError, success: !result.isError }"
            >
                {{ result.message }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import { REST_URL } from "@/config";

const router = useRouter();
const userStore = useUserStore();

const result = ref({
    message: "",
    isError: false,
});

const leaveRoom = async () => {
    result.value = { message: "", isError: false };

    try {
        const response = await axios.patch(
            `${REST_URL}/rooms/leave-room`,
            { room_id: userStore.currentRoom.room_id },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            },
        );

        if (response.status == 204) {
            userStore.currentRoom = null;
            router.push("/home");
        }
    } catch (error) {
        if (error.response) {
            result.value = {
                message:
                    error.response.data.error || "An unexpected error occurred",
                isError: true,
            };
        } else {
            result.value = {
                message: "Failed to connect to the server",
                isError: true,
            };
        }
    }
};
</script>

<style scoped>
@import "@/assets/actions.css";
</style>
