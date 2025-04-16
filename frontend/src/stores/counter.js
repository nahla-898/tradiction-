// src/stores/discussionStore.js
import { defineStore } from "pinia";
import api from "@/services/api";

export const useDiscussionStore = defineStore("discussion", {
  state: () => ({
    messages: [],
    isTyping: false, // Nouvel état
    loading: false,
    error: null,
  }),
  actions: {
    async fetchMessages(conversationId) {
      this.loading = true;
      try {
        const response = await api.get(`/messages/${conversationId}`);
        this.messages = response.data;
      } catch (error) {
        this.error = "Erreur lors du chargement des messages.";
      } finally {
        this.loading = false;
      }
    },
    async sendMessage(content) {
      try {
        this.isTyping = false; // Arrêter l’indicateur
        const newMessage = { content, sender: "user", timestamp: new Date() };
        const response = await api.post("/messages", newMessage);
        this.messages.push(response.data);
      } catch (error) {
        this.error = "Impossible d'envoyer le message.";
      }
    },
    setTyping(status) {
      this.isTyping = status;
    },
  },
});