<template>
  <div class="group-detail">
    <h1>{{ group.name }}</h1>

    <member-list class="member-list"></member-list>
    <add-member v-if="networkOnLine && membersLoaded"></add-member>

    <pet-list class="pet-list"></pet-list>
    <add-pet v-if="networkOnLine && petsLoaded"></add-pet>
  </div>
</template>

<script>
import MemberList from '@/components/member/MemberList'
import AddMember from '@/components/member/AddMember'
import PetList from '@/components/pet/PetList'
import AddPet from '@/components/pet/AddPet'
import { mapState, mapGetters } from 'vuex'

export default {
  components: { MemberList, AddMember, PetList, AddPet },
  props: {
    group: Object,
  },
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapGetters('members', ['membersLoaded']),
    ...mapGetters('pets', ['petsLoaded']),
  },
  created() {
    this.$store.dispatch('members/getActiveGroupMembers')
    this.$store.dispatch('pets/getActiveGroupPets')
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.group-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
