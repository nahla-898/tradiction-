<template>
    <div class="chat-container">
      <div class="chat-header">
        <img :src="user.avatar" alt="User Avatar" class="avatar" />
        <div class="user-info">
          <h3>{{ user.name }}</h3>
          <p class="status">{{ statusText }}</p>
        </div>
        <i class="fa fa-search search-icon" @click="showSearchModal = true"></i>
      </div>
  
      <div class="chat-messages">
        <div 
          v-for="msg in messages" 
          :key="msg.id"
          class="message-bubble"
          :class="{ 'sent': msg.sent, 'received': !msg.sent }"
          :data-message-id="msg.id">
          <span>{{ renderMessageWithEmojis(msg.text) }}</span> <!-- Remplacement de v-html -->
          <span class="timestamp">{{ msg.time }}</span>
        </div>
        
        <div v-if="isTyping" class="typing-indicator">En train d'écrire...</div>
      </div>
  
      <div class="chat-input">
        <input 
          v-model="newMessage" 
          @keyup.enter="sendMessage" 
          placeholder="Message"
          ref="messageInput" />
        <div class="input-icons">
          <i class="fa fa-smile-o input-icon" @click="showEmojiPicker = true"></i>
          <i class="fa fa-paperclip input-icon" @click="showAttachmentModal = true"></i>
          <i class="fa fa-microphone input-icon" @click="startVoice"></i>
          <button class="send-button" @click="sendMessage">
            <i class="fa fa-paper-plane send-icon"></i>
          </button>
        </div>
      </div>
  
      <!-- Modal pour les émojis -->
      <div v-if="showEmojiPicker" class="emoji-modal-overlay" @click="showEmojiPicker = false">
        <div class="emoji-modal" @click.stop>
          <emoji-picker @emoji-click="addEmoji"></emoji-picker> <!-- Composant emoji-picker -->
          <button class="close-btn" @click="showEmojiPicker = false">×</button>
        </div>
      </div>
  
      <!-- Modal pour les pièces jointes -->
      <div v-if="showAttachmentModal" class="modal-overlay" @click="showAttachmentModal = false">
        <div class="attachment-modal" @click.stop>
          <div class="modal-header">
            <h3>Pièces jointes</h3>
            <button class="close-btn" @click="showAttachmentModal = false">×</button>
          </div>
          <div class="attachment-options">
            <div class="attachment-option" @click="handleCamera">
              <i class="fa fa-camera"></i>
              <span>Appareil photo</span>
            </div>
            <div class="attachment-option" @click="handlePDF">
              <i class="fa fa-file-pdf-o"></i>
              <span>Document PDF</span>
            </div>
            <div class="attachment-option" @click="handleGallery">
              <i class="fa fa-picture-o"></i>
              <span>Galerie</span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal pour la recherche de messages -->
      <div v-if="showSearchModal" class="modal-overlay" @click="showSearchModal = false">
        <div class="search-modal" @click.stop>
          <div class="modal-header">
            <h3>Rechercher un message</h3>
            <button class="close-btn" @click="showSearchModal = false">×</button>
          </div>
          
          <div class="search-controls">
            <div class="search-input-container">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Rechercher par texte..."
                class="search-input"
                @input="performSearch"
              >
              <i class="fa fa-search"></i>
            </div>
            
            <div class="date-picker-container">
              <label>Rechercher par date :</label>
              <input 
                type="date" 
                v-model="searchDate" 
                @change="performSearch"
                class="date-input"
              >
              <button 
                v-if="searchDate" 
                @click="clearDateFilter"
                class="clear-date-btn"
              >
                ×
              </button>
            </div>
          </div>
          
          <div class="search-results">
            <div 
              v-for="result in searchResults" 
              :key="result.id"
              class="search-result-item"
              @click="scrollToMessage(result.id)"
            >
              <p class="result-text" v-html="renderMessageWithEmojis(result.text)"></p>
              <div class="result-meta">
                <span class="result-time">{{ result.time }}</span>
                <span class="result-date">{{ formatDate(result.timestamp) }}</span>
              </div>
            </div>
            <div v-if="searchResults.length === 0 && (searchQuery || searchDate)" class="no-results">
              Aucun résultat trouvé
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import 'emoji-picker-element'; // Importation de la bibliothèque
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import * as emoji from 'node-emoji';
  
  
  const user = ref({ 
    name: 'David Moore', 
    avatar: '/src/assets/avatar.png',
    lastSeen: new Date().getTime() - 5 * 60 * 1000
  });
  
  
  const getStatus = () => {
    const now = new Date().getTime();
    const diff = Math.floor((now - user.value.lastSeen) / 1000);
  
    if (diff < 60) return "En ligne";
    if (diff < 3600) return `Vu il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Vu il y a ${Math.floor(diff / 3600)} h`;
    return "Hors ligne";
  };
  
  const statusText = ref(getStatus());
  
  const messages = ref([
    { 
      id: 1, 
      text: "Hello :smile:! How are you?", 
      time: "18:51", 
      sent: false,
      timestamp: new Date().setHours(18, 51, 0) 
    },
    { 
      id: 2, 
      text: "I'm good :thumbsup:!", 
      time: "18:52", 
      sent: true,
      timestamp: new Date().setHours(18, 52, 0) 
    },
    { 
      id: 3, 
      text: "See you tomorrow :wave:!", 
      time: "18:53", 
      sent: true,
      timestamp: new Date().setHours(18, 53, 0) 
    }
  ]);
  
  const newMessage = ref('');
  const isTyping = ref(false);
  const showAttachmentModal = ref(false);
  const showEmojiPicker = ref(false);
  const showSearchModal = ref(false);
  const searchQuery = ref('');
  const searchDate = ref('');
  const searchResults = ref([]);
  const messageInput = ref(null);
  
  let statusInterval = null;
  
  onMounted(() => {
    statusInterval = setInterval(() => {
      statusText.value = getStatus();
    }, 30000);
  });
  
  onUnmounted(() => {
    clearInterval(statusInterval);
  });
  
  const renderMessageWithEmojis = (text) => {
    return emoji.emojify(text); // Transforme les codes d'émojis en émojis natifs
  };
  
  const sendMessage = () => {
    if (newMessage.value.trim() === '') return;
    
    const now = new Date();
    const newMsg = {
      id: Date.now(),
      text: newMessage.value,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: true,
      timestamp: now.getTime()
    };
    
    messages.value.push(newMsg);
    newMessage.value = '';
  };
  
  const addEmoji = (event) => {
    const emoji = event.detail.unicode; // Récupérer l'emoji sélectionné
    newMessage.value += emoji;
    showEmojiPicker.value = false; // Fermer le sélecteur
    messageInput.value.focus(); // Recentrer sur le champ de saisie
  };
  
  const startVoice = () => {
    alert('Reconnaissance vocale en cours...');
  };
  
  const handleCamera = () => {
    alert('Ouverture de la caméra...');
    showAttachmentModal.value = false;
  };
  
  const handlePDF = () => {
    alert('Sélection de document PDF...');
    showAttachmentModal.value = false;
  };
  
  const handleGallery = () => {
    alert('Ouverture de la galerie...');
    showAttachmentModal.value = false;
  };
  
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const performSearch = () => {
    if (!searchQuery.value.trim() && !searchDate.value) {
      searchResults.value = [];
      return;
    }
    
    const query = searchQuery.value.toLowerCase();
    const selectedDate = searchDate.value;
    
    searchResults.value = messages.value.filter(msg => {
      const matchesText = query ? msg.text.toLowerCase().includes(query) : true;
      
      let matchesDate = true;
      if (selectedDate) {
        const msgDate = new Date(msg.timestamp).toISOString().split('T')[0];
        matchesDate = msgDate === selectedDate;
      }
      
      return matchesText && matchesDate;
    });
  };
  
  const clearDateFilter = () => {
    searchDate.value = '';
    performSearch();
  };
  
  const scrollToMessage = (id) => {
    const element = document.querySelector(`[data-message-id="${id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      element.classList.add('highlight');
      setTimeout(() => element.classList.remove('highlight'), 2000);
    }
    showSearchModal.value = false;
  };
  </script>
  
  <style src="../assets/styles.css"></style>