import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    username: null,
    createdAt: null,
    roomIds: [],
    currentRoom: null,
  }),
  actions: {
    setUser(data) {
      this.username = data.username;
      // From DB keep snake_case
      this.createdAt = data.created_at;
      this.roomIds = data.room_ids;
    },
    clearUser() {
      this.$reset();
      localStorage.removeItem("user");
    },
  },
  persist: true,
});
