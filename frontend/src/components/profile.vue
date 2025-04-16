<template>
  <div class="container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo"></div>
      <ul>
        <li>
          <i class="icon">
            <img src="https://img.icons8.com/ios-filled/24/000000/user.png" alt="User Icon" />
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

    <!-- Main content -->
    <main class="content">
      <h2>Profile</h2>
      <div class="profile-card">
        <img :src="user.profilePic" alt="Profile" class="profile-pic" />
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
        <p><strong>Country:</strong> {{ user.country }}</p>
        <p><strong>Language:</strong> {{ user.language }}</p>

        <router-link :to="'/edit/' + user.id" class="edit-btn">Edit</router-link>
      </div>

      <!-- Affichage des formations -->
      <div class="formations" v-if="formations.length">
        <h3>Formations</h3>
        <ul>
          <li v-for="formation in formations" :key="formation.id">
            <strong>{{ formation.titre }}</strong> à {{ formation.institution }} ({{ formation.annee }})<br />
            <em>{{ formation.description }}</em>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {},
      formations: []
    };
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    fetchUserData() {
      const userId = this.$route.params.id;
      axios.get(`http://localhost:3000/api/user/${userId}`)
        .then(response => {
          this.user = response.data;
          this.fetchFormations(userId);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    },
    fetchFormations(userId) {
      axios.get(`http://localhost:3000/api/user/${userId}/formations`)
        .then(response => {
          this.formations = response.data;
        })
        .catch(error => {
          console.error('Erreur lors du chargement des formations :', error);
        });
    }
  }
};
</script>

  
  
  <style scoped>
  .container {
    display: flex;
    height: 100vh;
  }
  
  /* Barre latérale */
  .sidebar {
    width: 20%;
    background: linear-gradient(to bottom, #a17dc3, #ffd1f5);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  
  .logo {
    width: 50px;
    height: 50px;
    background: #fff;
    border-radius: 50%;
    margin-bottom: 20px;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  .icon {
    font-size: 24px;
    margin: 15px 0;
    cursor: pointer;
    display: block;
  }
  
  /* Contenu principal */
  .content {
    width: 80%;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .profile-card {
    text-align: center;
    padding: 40px;
    border: 1px solid #ddd;
    border-radius: 10px;
    width: 300px;
    background: #fff;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .profile-pic {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  /* Bouton de modification */
  .edit-btn {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background: #a17dc3;
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 5px;
    text-decoration: none;
    font-weight: bold;
  }
  
  .edit-btn:hover {
    background: #a17dc3;
  }
  </style>
  