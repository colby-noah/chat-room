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
            :class="{ selected: user === selected_user }"
            @click="selected_user = user"
          >
            {{ user.username }}
          </li>
        </ul>
      </div>
      <div v-if="selected_user">
        <p style="color: white; font-size: 14pt; padding: 10px">
          Remove: {{ selected_user.username }}
        </p>
      </div>
      <button class="button-gray submit" @click="removeUser()">Submit</button>
      <p
        v-if="result.message"
        :class="{ error: result.is_error, success: !result.is_error }"
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

const selected_user = ref(null);

const result = ref({
  message: "",
  is_error: false,
});

const removeUser = async () => {
  if (!selected_user.value) return;

  result.value = { message: "", is_error: false };

  try {
    const response = await axios.patch(
      `${REST_URL}/rooms/remove-user`,
      {
        room_id: userStore.current_room.room_id,
        user_id: selected_user.value.user_id,
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
        is_error: false,
      };
      getUsers();
    }
  } catch (error) {
    if (error.response) {
      result.value = {
        message: error.response.data.error || "An unexpected error occurred",
        is_error: true,
      };
    } else {
      result.value = {
        message: "Failed to connect to the server",
        is_error: true,
      };
    }
  }
};

const getUsers = async () => {
  try {
    const response = await axios.get(
      `${REST_URL}/rooms/users/${userStore.current_room.room_id}`,
    );

    if (response.status == 200 && response.data.users_info) {
      users.value = response.data.users_info;
    }
  } catch (error) {
    result.value = { message: "Failed to fetch users", is_error: true };
  }
};

onMounted(async () => {
  getUsers();
});
</script>

<style scoped>
@import "@/assets/actions.css";
</style>
