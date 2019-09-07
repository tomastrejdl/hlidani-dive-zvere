<template>
  <div>
    <h1>Members</h1>
    <p v-if="members === null" class="infos-label">Loading...</p>
    <p v-if="members && !members.length" class="infos-label">
      You don't have any member yet
    </p>
    <member-item
      v-for="(member, index) in members"
      :key="member.id"
      class="member-row"
      :index="index"
      :is-member-deletion-pending="isMemberRemovePending(member.id)"
      :disable-actions="!networkOnLine"
      :member="member"
      @removeMember="removeMember"
    ></member-item>
  </div>
</template>

<script>
import MemberItem from '@/components/member/MemberItem'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: { MemberItem },
  computed: {
    ...mapGetters('members', ['isMemberRemovePending']),
    ...mapGetters('users', ['getUserById']),
    ...mapState('members', ['members']),
    ...mapState('app', ['networkOnLine']),
  },
  methods: mapActions('members', ['removeMember']),
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.infos-label {
  text-align: center;
}

.member-row {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 10px auto;
  justify-content: space-between;
}
</style>
