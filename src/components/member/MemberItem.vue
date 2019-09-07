<template>
  <div class="member-item">
    <span class="member-name">
      <img :src="member.photoURL" width="50px" />
      #{{ index }} {{ member.userId }}
      {{ member.owner ? 'Owner' : '' }}
      {{ !member.accepted ? 'Invited...' : '' }}
    </span>
    <div
      v-if="!disableActions && !member.owner"
      class="delete-btn"
      @click="$emit('removeMember', member.id)"
    >
      {{ isMemberRemovePending ? 'delete in progress...' : 'delete' }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    member: Object,
    index: Number,
    isMemberRemovePending: Boolean,
    disableActions: Boolean,
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .member-name {
    color: $vue-color;
  }

  .delete-btn {
    cursor: pointer;
    padding: 5px 10px;
    border: 1px solid;
    display: inline-block;
    border-radius: 3px;
    margin-left: 10px;
    color: $danger-color;
    border-color: $danger-color;
  }
}
</style>
