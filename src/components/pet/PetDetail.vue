<template>
  <div class="pet-detail">
    <h1>{{ pet.name }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    pet: Object,
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.pet-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
