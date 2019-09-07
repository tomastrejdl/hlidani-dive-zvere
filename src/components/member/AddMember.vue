<template>
  <div class="member-action-bar">
    <input
      placeholder="User email..."
      class="member-name-input"
      type="text"
      :value="memberEmailToAdd"
      @input="setMemberEmailToAdd($event.target.value)"
      @keypress.enter="triggerAddMemberAction"
    />
    <div
      :class="{ disabled: memberCreationPending }"
      class="create-member-btn"
      @click="triggerAddMemberAction"
    >
      add member
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'

export default {
  computed: mapState('members', ['memberEmailToAdd', 'memberCreationPending']),
  methods: {
    ...mapMutations('members', ['setMemberEmailToAdd']),
    ...mapActions('members', ['triggerAddMemberAction']),
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.member-action-bar {
  display: flex;
  align-items: center;
  justify-content: center;

  .member-name-input {
    padding-left: 5px;
    height: 30px;
    width: 150px;
    outline: none;
    font: inherit;
    border: 1px solid;
    border-color: #2c3e50;
    border-radius: 3px;
  }

  .create-member-btn {
    cursor: pointer;
    padding: 5px 10px;
    border: 1px solid;
    display: inline-block;
    border-radius: 3px;
    margin-left: 10px;
    border-color: #2c3e50;

    &.disabled {
      pointer-events: none;
      background-color: #aaa;
    }

    &:hover {
      color: $vue-color;
      border-color: $vue-color;
    }
  }
}
</style>
