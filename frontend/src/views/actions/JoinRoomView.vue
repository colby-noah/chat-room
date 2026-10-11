<template>
    <div class="flex-col-centered">
        <button class="button-gray back" @click="router.push('/home')">
            Back
        </button>
        <div class="action-container">
            <h1 style="color: var(--vue-green)">Join a Room</h1>
            <form autocomplete="off" @submit.prevent="handleSubmit">
                <label for="roomName">Room ID</label>
                <input
                    id="roomId"
                    v-model="roomId"
                    type="text"
                    placeholder="Enter the room ID"
                />

                <button type="submit" class="button-gray submit">Submit</button>
            </form>
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
import { REST_URL } from "@/config";

const router = useRouter();

const roomId = ref("");
const result = ref({
    message: "",
    isError: false,
});

const handleSubmit = async () => {
    result.value = { message: "", isError: false };

    try {
        const response = await axios.patch(
            `${REST_URL}/rooms/add-user`,
            { room_id: roomId.value },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            },
        );

        if (response.status == 200 || response.status == 204) {
            result.value = {
                message: "Successfully joined room",
                isError: false,
            };
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
