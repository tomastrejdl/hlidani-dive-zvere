<template>
  <div class="page-wrapper">
    <group-detail v-if="currentGroup" :group="currentGroup"></group-detail>
    <invite-user :group="currentGroup"></invite-user>

    <pet-list class="pet-list"></pet-list>
    <add-pet v-if="networkOnLine"></add-pet>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import GroupDetail from '@/components/group/GroupDetail'
import InviteUser from '@/components/group/InviteUser'
import PetList from '@/components/pet/PetList'
import AddPet from '@/components/pet/AddPet'

export default {
  components: { GroupDetail, InviteUser, PetList, AddPet },
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
  methods: {
    ...mapActions('groups', ['inviteUser']),
  },
}
</script>
