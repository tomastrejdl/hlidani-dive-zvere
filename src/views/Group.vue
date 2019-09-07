<template>
  <div class="page-wrapper">
    <group-detail v-if="currentGroup" :group="currentGroup"></group-detail>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import GroupDetail from '@/components/group/GroupDetail'

export default {
  components: { GroupDetail },
  props: {
    id: String,
  },
  computed: {
    ...mapGetters('groups', ['getGroupById']),
    ...mapState('app', ['networkOnLine']),
    currentGroup() {
      return this.getGroupById(this.id)
    },
  },
  created() {
    this.$store.dispatch('app/setActiveGroup', this.id)
  },
  methods: {
    ...mapActions('groups', ['inviteUser']),
  },
}
</script>
