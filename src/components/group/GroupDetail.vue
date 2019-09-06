<template>
  <div class="group-detail">
    <h1>{{ group.name }}</h1>
    <ul>
      <li v-for="member in group.members" :key="member.id">
        <img :src="member.photoURL" width="100px" />
        {{ member.displayName }} {{ member.accepted ? '' : 'Invited...' }}
        {{ member.owner ? 'Owner' : '' }}
      </li>
    </ul>
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
