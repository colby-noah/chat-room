<template>
  <div class="flex-col-centered">
    <button class="button-gray back" @click="router.push('/room-options')">
      Back
    </button>
    <div class="action-container">
      <h1 style="color: var(--vue-green)">Remove a User</h1>
      <div v-if="users.length > 0" class="users-container">
        <ul class="user-list-ul">
          <li
            v-for="(user, index) in users"
            :key="index"
            class="user-list-li"
            :class="{ selected: user === selectedUser }"
            @click="selectedUser = user"
          >
            {{ user.username }}
          </li>
        </ul>
      </div>
      <div v-if="selectedUser">
        <p style="color: white; font-size: 14pt; padding: 10px">
          Remove: {{ selectedUser.username }}
        </p>
      </div>
      <button class="button-gray submit" @click="removeUser()">Submit</button>
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
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import { REST_URL } from "@/config";

const router = useRouter();
const userStore = useUserStore();

const users = ref([]);

const selectedUser = ref(null);

const result = ref({
  message: "",
  isError: false,
});

const removeUser = async () => {
  if (!selectedUser.value) return;

  result.value = { message: "", isError: false };

  try {
    const response = await axios.patch(
      `${REST_URL}/rooms/remove-user`,
      {
        room_id: userStore.currentRoom.room_id,
        user_id: selectedUser.value.user_id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (response.status == 200 || response.status == 204) {
      result.value = {
        message: "Successfully removed user",
        isError: false,
      };
      getUsers();
    }
  } catch (error) {
    if (error.response) {
      result.value = {
        message: error.response.data.error || "An unexpected error occurred",
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

const getUsers = async () => {
  try {
    const response = await axios.get(
      `${REST_URL}/rooms/users/${userStore.currentRoom.room_id}`,
    );

    if (response.status == 200 && response.data.users_info) {
      users.value = response.data.users_info;
    }
  } catch {
    result.value = { message: "Failed to fetch users", isError: true };
  }
};

onMounted(async () => {
  getUsers();
});
</script>

<style scoped>
@import "@/assets/actions.css";
</style>
