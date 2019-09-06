<template>
  <div class="page-wrapper">
    <h1 class="groups-page-title">Groups page</h1>
    <group-list class="group-list"></group-list>
    <add-group v-if="networkOnLine"></add-group>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import GroupList from '@/components/group/GroupList'
import AddGroup from '@/components/group/AddGroup'

export default {
  components: { GroupList, AddGroup },
  computed: mapState('app', ['networkOnLine']),
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.groups-page-title {
  text-align: center;
  margin-bottom: 60px;
}

.group-list {
  margin: 20px 0;
}
</style>
