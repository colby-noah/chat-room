<template>
    <div class="container">
        <div class="messages-container" @scroll="handleScroll">
            <p v-if="!userStore.currentRoom" class="placeholder">
                Choose a room
            </p>
            <p
                v-else-if="!messages.length && !loading.value"
                class="placeholder"
            >
                There are no messages, be the first!
            </p>

            <ul>
                <li
                    v-for="message in messages"
                    :key="message.created_at"
                    style="list-style-type: none; margin-top: 15px"
                >
                    <strong class="username">{{ message.username }}</strong>
                    <span style="padding-left: 1rem">{{
                        formatDate(message.created_at)
                    }}</span>
                    <br />
                    <span class="message">{{ message.content }}</span>
                </li>
            </ul>
        </div>

        <TypingBar class="typing-bar" />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import WebSocketService from "@/services/WebSocketService";
import { useUserStore } from "@/store/user";
import TypingBar from "./TypingBar.vue";
import { REST_URL } from "@/config";

const userStore = useUserStore();
const websocket = new WebSocketService();

const messages = ref([]);

const loading = ref(false);
const hasMoreMessages = ref(true);

const formatDate = (utcDate) => {
    if (!utcDate) return "";

    const timestamp = new Date(utcDate);

    const today = new Date();
    const isToday = timestamp.toDateString() === today.toDateString();

    const localDate = isToday
        ? ""
        : timestamp.toLocaleDateString(undefined, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
          });

    const localTime = timestamp.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    return `${localDate} ${localTime}`;
};

const getOldMessages = async (before = null) => {
    try {
        if (!userStore.currentRoom.room_id) {
            return;
        }

        loading.value = true;

        const limit = 20;

        const url = before
            ? `${REST_URL}/messages/${userStore.currentRoom.room_id}?limit=${limit}&before=${before}`
            : `${REST_URL}/messages/${userStore.currentRoom.room_id}?limit=${limit}`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (response.data.length < limit) {
            hasMoreMessages.value = false;
        }

        // Prepend older messages
        if (response.data) {
            messages.value = [...response.data.reverse(), ...messages.value];
        }
    } catch (error) {
        if (error.status != 404) {
            console.error("Error fetching messages: ", error);
        }
    } finally {
        loading.value = false;
    }
};

const handleScroll = (event) => {
    const container = event.target;

    const scrollbarPosition =
        Math.abs(container.scrollTop) + container.clientHeight + 50;
    const scrollHeight = container.scrollHeight;

    if (
        hasMoreMessages.value &&
        !loading.value &&
        scrollbarPosition >= scrollHeight
    ) {
        const oldestMessage = messages.value[0];

        if (oldestMessage) {
            getOldMessages(oldestMessage.created_at);
        }
    }
};

watch(
    () => userStore.currentRoom,
    (newRoom, oldRoom) => {
        if (newRoom && newRoom !== oldRoom) {
            messages.value = [];
            hasMoreMessages.value = true;
            getOldMessages();

            // Connect to the current room
            websocket.connect(userStore.currentRoom.room_id);
        }
    },
    { immediate: true },
);

// Watch for new messages received, add them to messages
watch(
    () => websocket.messages.value,
    () => {
        while (websocket.messages.value.length > 0) {
            messages.value.push(websocket.messages.value.shift());
        }
    },
    { deep: true, immediate: true },
);

onMounted(() => {
    messages.value = [];
});
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
}

.messages-container {
    display: flex;
    flex-direction: column-reverse;
    flex-grow: 1;
    margin-bottom: 20px;
    overflow-y: auto;
    scrollbar-color: white var(--foreground);
}

.messages-container::-webkit-scrollbar-thumb {
    background: white;
}

.messages-container::-webkit-scrollbar-track {
    background: var(--foreground);
}

.typing-bar {
    flex-shrink: 0;
    border-top: 3px solid var(--vue-green);
}

.placeholder {
    font-size: 20pt;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90%;
}

.username {
    font-size: 16pt;
    font-weight: bold;
    color: var(--vue-green);
}

.message {
    font-size: 14pt;
    color: white;
    white-space: pre-line;
    overflow-wrap: anywhere;
}
</style>
