<template>
  <div class="page-wrapper">
    <h1 class="home-page-title">{{ appTitle }}</h1>
    <img alt="logo-bento" class="logo" src="@/assets/img/bento-starter.svg" />

    <ion-card v-for="item in 2" :key="item">
      <ion-card-header>
        <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
        <ion-card-title>Card Title</ion-card-title>
      </ion-card-header>

      <ion-card-content>
        <ion-chip color="primary">
          <ion-label>Default chip</ion-label>
        </ion-chip>

        <ion-chip>
          <ion-label color="secondary">Secondary Label</ion-label>
        </ion-chip>

        <ion-chip color="secondary">
          <ion-label color="dark">Secondary w/ Dark label</ion-label>
        </ion-chip>
        <p>
          Keep close to Nature's heart... and break clear away, once in awhile,
          and climb a mountain or spend a week in the woods. Wash your spirit
          clean.
        </p>
        <ion-item>
          <ion-label>On</ion-label>
          <ion-toggle color="secondary"></ion-toggle>
        </ion-item>

        <ion-item>
          <ion-range min="-200" max="200" color="secondary">
            <ion-label slot="start">-200</ion-label>
            <ion-label slot="end">200</ion-label>
          </ion-range>
        </ion-item>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  head: function() {
    return {
      title: {
        inner: 'Home',
      },
      meta: [
        {
          name: 'description',
          content: `${this.appTitle} home page`,
          id: 'desc',
        },
      ],
    }
  },
  computed: mapState('app', ['appTitle']),
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.page-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .logo {
    margin-bottom: 3rem;
  }

  .home-page-title {
    text-align: center;
  }

  .documentation-link {
    display: inline-block;
    font-size: 1.2rem;
    color: #fff;
    background-color: #5d6788;
    padding: 0.8rem 1.6rem;
    border-radius: 4px;
    transition: background-color 0.1s ease;
    box-sizing: border-box;
    text-decoration: none;
    width: fit-content;
    font-weight: 500;
  }
}
</style>
