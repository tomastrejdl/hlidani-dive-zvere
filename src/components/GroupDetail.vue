<template>
  <div class="group-detail">
    <h1>{{ group.name }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    group: Object,
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.group-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
