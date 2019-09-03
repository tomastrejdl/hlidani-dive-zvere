<template>
  <div class="group-action-bar">
    <input
      placeholder="group name..."
      class="group-name-input"
      type="text"
      :value="groupNameToCreate"
      @input="setGroupNameToCreate($event.target.value)"
      @keypress.enter="triggerAddGroupAction"
    />
    <div
      :class="{ disabled: groupCreationPending }"
      class="create-group-btn"
      @click="triggerAddGroupAction"
    >
      add group
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'

export default {
  computed: mapState('groups', ['groupNameToCreate', 'groupCreationPending']),
  methods: {
    ...mapMutations('groups', ['setGroupNameToCreate']),
    ...mapActions('groups', ['triggerAddGroupAction']),
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.group-action-bar {
  display: flex;
  align-items: center;
  justify-content: center;

  .group-name-input {
    padding-left: 5px;
    height: 30px;
    width: 150px;
    outline: none;
    font: inherit;
    border: 1px solid;
    border-color: #2c3e50;
    border-radius: 3px;
  }

  .create-group-btn {
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
