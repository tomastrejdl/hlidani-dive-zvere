<template>
  <div class="page-wrapper">
    <group-detail v-if="currentGroup" :group="currentGroup"></group-detail>
    <invite-user :group="currentGroup"></invite-user>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import GroupDetail from '@/components/group/GroupDetail'
import InviteUser from '@/components/group/InviteUser'

export default {
  components: { GroupDetail, InviteUser },
  props: {
    id: String,
  },
  computed: {
    ...mapGetters('groups', ['getGroupById']),
    currentGroup() {
      return this.getGroupById(this.id)
    },
  },
  methods: {
    ...mapActions('groups', ['inviteUser']),
  },
}
</script>
