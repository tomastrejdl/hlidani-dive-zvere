<template>
  <div class="page-wrapper">
    <group-detail v-if="currentGroup" :group="currentGroup"></group-detail>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GroupDetail from '@/components/GroupDetail'

export default {
  components: { GroupDetail },
  props: {
    id: String,
  },
  computed: {
    ...mapGetters('groups', ['getGroupById']),
    currentGroup() {
      return this.getGroupById(this.id)
    },
  },
}
</script>
