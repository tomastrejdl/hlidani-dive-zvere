<template>
  <div class="event-detail">
    <h1>{{ event.from }} - {{ event.to }}</h1>
    <ul>
      <li :v-for="pet in event.pets">{{ getPetById(pet).displayName }}</li>
    </ul>
    {{ event.note }}
  </div>
</template>

<script>
export default {
  props: {
    event: Object,
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.event-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
