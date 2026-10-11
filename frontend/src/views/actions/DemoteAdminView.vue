<template>
  <div class="flex-col-centered">
    <button class="button-gray back" @click="router.push('/room-options')">
      Back
    </button>
    <div class="action-container">
      <h1 style="color: var(--vue-green)">Demote Admin to User</h1>
      <div v-if="admins.length > 0" class="users-container">
        <ul class="user-list-ul">
          <li
            v-for="(admin, index) in admins"
            :key="index"
            class="user-list-li"
            :class="{ selected: admin === selectedAdmin }"
            @click="selectedAdmin = admin"
          >
            {{ admin.username }}
          </li>
        </ul>
      </div>
      <div v-if="selectedAdmin">
        <p style="color: white; font-size: 1.5rem; padding: 10px">
          Demote: {{ selectedAdmin.username }}
        </p>
      </div>
      <button class="button-gray submit" @click="demoteAdmin()">Submit</button>
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

const admins = ref([]);

const selectedAdmin = ref(null);

const result = ref({
  message: "",
  isError: false,
});

const demoteAdmin = async () => {
  if (!selectedAdmin.value) return;

  result.value = { message: "", isError: false };

  try {
    const response = await axios.patch(
      `${REST_URL}/rooms/demote-admin`,
      {
        room_id: userStore.currentRoom.room_id,
        user_id: selectedAdmin.value.user_id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (response.status == 200 || response.status == 204) {
      result.value = {
        message: "Successfully demoted admin",
        isError: false,
      };
      getAdmins();
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

const getAdmins = async () => {
  try {
    const response = await axios.get(
      `${REST_URL}/rooms/admins/${userStore.currentRoom.room_id}`,
    );

    if (response.status == 200 && response.data.admins_info) {
      admins.value = response.data.admins_info;
    }
  } catch {
    result.value = { message: "Failed to fetch admins", isError: true };
  }
};

onMounted(async () => {
  getAdmins();
});
</script>

<style scoped>
@import "@/assets/actions.css";
</style>
