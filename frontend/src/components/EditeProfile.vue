<template>
  <div class="container">
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

    <main class="content">
      <h2>Edit Profile</h2>
      <div class="profile-card">
        <img :src="user.profilePic" alt="Profile" class="profile-pic" />
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
      </div>
      <form @submit.prevent="saveProfile">
        <div class="form-group">
          <label>Full Name</label>
          <input v-model="user.name" type="text" placeholder="Your Full Name" />
        </div>
        <div class="form-group">
          <label>Country</label>
          <select v-model="user.country">
            <option v-for="(name, code) in countriesList" :key="code" :value="code">
              {{ name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Phone Number</label>
          <input v-model="user.phoneNumber" type="text" placeholder="Your Phone Number" />
        </div>
        <div class="form-group">
          <label>Language</label>
          <select v-model="user.language">
            <option v-for="(name, code) in languages" :key="code" :value="code">
              {{ name }}
            </option>
          </select>
        </div>
        <button type="submit" class="save-btn">Save</button>
      </form>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
      
        name: '',
        email: '',
        country: '',
        phoneNumber: '',
        language: '',
        profilePic: '',
      },
      countriesList: {}, // Liste des pays
      languages: {}, // Liste des langues
    };
  },
  mounted() {
    this.fetchUserData();
    this.getAllCountries();
    this.getAllLanguages();
  },
  methods: {
    fetchUserData() {
      const userId = this.$route.params.id;
      axios.get(`http://localhost:3000/api/user/${userId}`)
        .then(response => {
          this.user = response.data;
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    },
    saveProfile() {
      const userId = this.$route.params.id;
      axios.put(`http://localhost:3000/api/user/${userId}`, this.user)
        .then(() => {
          alert('Profile updated successfully!');
        })
        .catch(error => {
          console.error('Error updating profile:', error);
        });
    },
    getAllCountries() {
      axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        const countries = {};
        response.data.forEach(country => {
          if (country.cca2 && country.name?.common) {
            countries[country.cca2] = country.name.common;
          }
        });
        this.countriesList = countries;
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
    },
    getAllLanguages() {
      this.languages = {
      en: 'English',
      fr: 'Français',
      ar: 'العربية',
      es: 'Español',
      de: 'Deutsch'
      };
    },
  },
};
</script>


<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 20%;
  background: linear-gradient(to bottom,  #a17dc3, #ffd1f5);
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
  margin: 10px 0;
  cursor: pointer;
  display: block;
}

.content {
  width: 80%;
  padding: 40px;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-pic {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.profile-form {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.form-group {
  flex: 1 1 calc(50% - 10px);
  display: flex;
  flex-direction: column;
}

input, select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.save-btn {
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
.save-btn:hover {
  background:#a17dc3;
}
</style>
