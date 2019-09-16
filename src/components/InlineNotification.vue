<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>New invitation</ion-card-title>
      <ion-card-subtitle>
        {{ message }}
      </ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      <ion-button @click="$emit('buttonClicked')">Join</ion-button>
    </ion-card-content>
  </ion-card>
</template>

<script>
export default {
  props: {
    message: String,
  },
}
</script>

<style></style>
