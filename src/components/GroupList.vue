<template>
  <div>
    <p v-if="groups === null" class="infos-label">Loading...</p>
    <p v-if="groups && !groups.length" class="infos-label">
      You don't have any group yet
    </p>
    <group-item
      v-for="(group, index) in groups"
      :key="group.id"
      class="group-row"
      :index="index"
      :is-group-deletion-pending="isGroupDeletionPending(group.id)"
      :disable-actions="!networkOnLine"
      :data="group"
      @deleteGroup="deleteGroup"
    ></group-item>
  </div>
</template>

<script>
import GroupItem from '@/components/GroupItem'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: { GroupItem },
  computed: {
    ...mapGetters('groups', ['isGroupDeletionPending']),
    ...mapState('groups', ['groups']),
    ...mapState('app', ['networkOnLine']),
  },
  methods: mapActions('groups', ['deleteGroup']),
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.infos-label {
  text-align: center;
}

.group-row {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 10px auto;
  justify-content: space-between;
}
</style>
