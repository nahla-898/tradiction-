<template>
  <div class="container">
    <div class="settings-page">
      <div class="sidebar">
        <aside>
          <div class="logo"></div>
          <ul>
            <li>
              <i class="icon">
                <router-link :to="`#`" class="nav-link">

                <img src="https://img.icons8.com/ios-filled/24/000000/user.png" alt="User Icon" />
              </router-link>
              </i>
            </li>
            <li>
            
              <i class="icon">
                <router-link :to="`/`" class="nav-link">

                <img src="https://img.icons8.com/ios-filled/24/000000/comments.png" alt="Messages Icon" />
              </router-link>

              </i>
            </li>
            <li>
              <i class="icon">
                <router-link :to="`/settings`" class="nav-link">

                <img src="https://img.icons8.com/ios-filled/24/000000/settings.png" alt="Settings Icon" />
              </router-link>

              </i>
            </li>
          </ul>
        </aside>
      </div>

      <div class="content">
        <h2>Paramètres de Traduction</h2>

        <div class="setting-group">
          <label for="language">🌐 Langue par défaut</label>
          <select id="language" v-model="defaultLanguage">
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        <div class="setting-group">
          <label for="autoTranslate">🔄 Traduction automatique</label>
          <div class="toggle-switch">
            <input type="checkbox" id="autoTranslate" v-model="autoTranslate" />
            <span class="slider"></span>
          </div>
        </div>

        <div class="setting-group">
          <label>📱 Langues préférées</label>
          <div class="preferred-languages">
            <div v-for="lang in availableLanguages" :key="lang.code" class="language-item">
              <input type="checkbox" :id="lang.code" v-model="preferredLanguages" :value="lang.code" />
              <label :for="lang.code">{{ lang.name }}</label>
            </div>
          </div>
        </div>

        <div class="setting-group">
          <label>🔔 Notifications</label>
          <div class="notification-settings">
            <div class="notification-item">
              <input type="checkbox" id="messageNotification" v-model="messageNotification" />
              <label for="messageNotification">Notifications de nouveaux messages</label>
            </div>
            <div class="notification-item">
              <input type="checkbox" id="translationNotification" v-model="translationNotification" />
              <label for="translationNotification">Notifications de traduction</label>
            </div>
          </div>
        </div>

        <div class="setting-group">
          <label>🎨 Thème</label>
          <button @click="toggleTheme" class="theme-button">
            {{ isDark ? 'Passer au thème clair' : 'Passer au thème sombre' }}
          </button>
        </div>

        <div class="setting-group">
          <label>❓ Aide</label>
          <p>Pour toute assistance, contactez-nous à : <strong>support@traduction-instantanee.com</strong></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const defaultLanguage = ref('fr')
const isDark = ref(false)
const autoTranslate = ref(true)
const messageNotification = ref(true)
const translationNotification = ref(true)

const availableLanguages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' }
]

const preferredLanguages = ref(['fr', 'en'])

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.body.classList.toggle('dark-theme', isDark.value)
}
</script>

<style>
/* --- Layout --- */
.container {
  display: flex;
  height: 100vh;
}
.settings-page {
  display: flex;
  font-family: 'Segoe UI', sans-serif;
  height: 100vh;
}
.sidebar {
  background: linear-gradient(to bottom, #f8c7f1, #a17dc3);
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar ul li {
  margin: 20px 0;
  cursor: pointer;
}
.sidebar .icon img {
  width: 24px;
  height: 24px;
}

/* --- Content --- */
.content {
  flex: 1;
  padding: 50px;
  background-color: #f5f5f5;
}
.setting-group {
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.setting-group label {
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
  color: #333;
}
.setting-group select,
.theme-button {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  max-width: 300px;
  background-color: white;
}

/* --- Thème bouton --- */
.theme-button {
  background-color: #a17dc3;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}
.theme-button:hover {
  background-color: #8a6cb3;
}

/* --- Listes de langues --- */
.preferred-languages {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}
.language-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* --- Notifications --- */
.notification-settings {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.notification-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* --- Switch --- */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #a17dc3;
}
input:checked + .slider:before {
  transform: translateX(26px);
}

/* --- Dark theme --- */
.dark-theme {
  background-color: #1a1a1a;
  color: white;
}
.dark-theme .content {
  background-color: #2d2d2d;
}
.dark-theme .setting-group {
  background-color: #333;
  color: white;
}
.dark-theme .setting-group label {
  color: white;
}
.dark-theme select,
.dark-theme .theme-button {
  background-color: #444;
  color: white;
  border-color: #555;
}
</style>
