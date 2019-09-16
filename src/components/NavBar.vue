<template>
  <header class="navbar" :class="{ offline: !networkOnLine }">
    <ion-select
      class="room-select"
      :interface-options="customActionSheetOptions"
      interface="action-sheet"
      :value="activeGroup"
      :disabled="$route.name === 'group'"
      @ionChange="setActiveGroup($event.target.value)"
    >
      <ion-select-option
        v-for="group in groups"
        :key="group.id"
        :value="group.id"
      >
        {{ group.name }}
      </ion-select-option>
    </ion-select>

    <div class="links">
      <nav class="nav-links">
        <div class="nav-item">
          <router-link to="/home">Home</router-link>
        </div>
        <div class="nav-item">
          <router-link to="/groups">Groups</router-link>
        </div>
        <div v-if="!isUserLoggedIn && networkOnLine" class="nav-item">
          <router-link to="/login">Login</router-link>
        </div>
        <div
          v-if="isUserLoggedIn && networkOnLine"
          class="nav-item logout-item"
          @click="logout"
        >
          <a>Logout</a>
        </div>
        <div v-if="!networkOnLine" class="nav-item offline-label">Offline</div>
      </nav>

      <img
        v-if="isUserLoggedIn && networkOnLine"
        class="user-picture can-hide"
        :src="user.photoURL"
        alt="Avatar"
      />
    </div>
  </header>
</template>

<script>
import firebase from 'firebase/app'
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  data: () => ({
    customActionSheetOptions: {
      header: 'Colors',
      subHeader: 'Select your favorite color',
    },
  }),
  computed: {
    ...mapGetters('authentication', ['isUserLoggedIn']),
    ...mapState('authentication', ['user']),
    ...mapState('app', [
      'networkOnLine',
      'appTitle',
      'appShortTitle',
      'activeGroup',
    ]),
    ...mapState('groups', ['groups']),
  },
  methods: {
    ...mapActions('app', ['setActiveGroup']),
    async logout() {
      await firebase.auth().signOut()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.navbar {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  right: 0;
  height: $navbar-height;
  background-color: $navbar-color;
  box-sizing: border-box;
  border-bottom: 1px solid #eaecef;
  padding: 0.7rem 1.5rem;
  // line-height: 2.2rem;

  .room-select {
    width: fit-content;
  }

  a {
    display: flex;
    align-items: center;
  }

  .title-desktop {
    display: inline;
  }

  .title-mobile {
    display: none;
  }

  @media (max-width: 500px) {
    padding: 0.7rem 0.7rem;

    .can-hide {
      display: none;
    }

    .title-desktop {
      display: none;
    }

    .title-mobile {
      display: block;
    }
  }

  .site-name {
    color: #2c3e50;
    position: relative;
  }

  .logo {
    height: 24px;
    padding-right: 8px;
  }

  .links {
    padding-left: 1.5rem;
    box-sizing: border-box;
    white-space: nowrap;
    font-size: 0.9rem;
    position: absolute;
    right: 1.5rem;
    top: 0.7rem;
    display: flex;

    .nav-links {
      display: flex;
      align-items: center;
      justify-content: center;

      .nav-item {
        position: relative;
        display: inline-block;
        margin-left: 1.5rem;
        line-height: 2.2rem;

        &:first-child {
          margin-left: 0;
        }

        a {
          font-weight: 500;
          font-size: 0.9rem;
          text-decoration: none;
          color: $navbar-link-color;
          border-color: #2c3e50;
          line-height: 1.4rem;
          display: inline-block;
          cursor: pointer;
        }

        @mixin activatedLink() {
          margin-bottom: -2px;
          border-bottom: 2px solid $vue-color;
        }

        .router-link-active {
          @include activatedLink;
        }

        @media (hover) {
          :hover {
            @include activatedLink;
          }
        }
      }
    }
  }

  &.offline {
    background: $navbar-offline-color;
    .links .nav-links .nav-item a,
    .site-name {
      color: white;
    }
  }

  .user-picture {
    max-height: 32px;
    margin-left: 1.5rem;
    border-radius: 50%;
  }

  .offline-label {
    padding: 0px 10px;
    border: 1px solid white;
    border-radius: 5px;
    color: white;
    margin-left: 1.5rem;
  }
}
</style>
