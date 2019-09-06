<template>
  <div class="invite-user-action-bar">
    <input
      placeholder="User email..."
      class="invite-user-input"
      type="text"
      :value="userEmailToInvite.email"
      @input="
        setUserEmailToInvite({ groupId: group.id, email: $event.target.value })
      "
      @keypress.enter="triggerInviteUserAction"
    />
    <div
      :class="{ disabled: userInvitiationPending }"
      class="invite-user-btn"
      @click="triggerInviteUserAction"
    >
      Invite user
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'

export default {
  props: {
    group: Object,
  },
  computed: mapState('groups', ['userEmailToInvite', 'userInvitiationPending']),
  methods: {
    ...mapMutations('groups', ['setUserEmailToInvite']),
    ...mapActions('groups', ['triggerInviteUserAction']),
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.invite-user-action-bar {
  display: flex;
  align-items: center;
  justify-content: center;

  .invite-user-input {
    padding-left: 5px;
    height: 30px;
    width: 150px;
    outline: none;
    font: inherit;
    border: 1px solid;
    border-color: #2c3e50;
    border-radius: 3px;
  }

  .invite-user-btn {
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
