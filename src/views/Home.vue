<template>
  <div class="page-wrapper">
    <div class="calendar">
      <div
        v-for="(week, i) in calendar"
        :key="i"
        class="week"
        :class="{ first: i === 0, last: i === calendar.length - 1 }"
      >
        <div v-for="(day, j) in week" :key="j" class="day">
          {{ day }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    calendar: [
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10, 11, 12],
      [13, 14, 15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24, 25, 26],
      [27, 28, 29, 30, 31],
    ],
  }),
  head: function() {
    return {
      title: {
        inner: 'Home',
      },
      meta: [
        {
          name: 'description',
          content: `${this.appTitle} home page`,
          id: 'desc',
        },
      ],
    }
  },
  computed: mapState('app', ['appTitle']),
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.week {
  width: 100%;
  display: flex;
  flex-direction: row;

  &.first {
    justify-content: flex-end;
  }
}

.day {
  height: 2rem;
  width: 2rem;
  border: 1px solid grey;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .logo {
    margin-bottom: 3rem;
  }

  .home-page-title {
    text-align: center;
  }

  .documentation-link {
    display: inline-block;
    font-size: 1.2rem;
    color: #fff;
    background-color: #5d6788;
    padding: 0.8rem 1.6rem;
    border-radius: 4px;
    transition: background-color 0.1s ease;
    box-sizing: border-box;
    text-decoration: none;
    width: fit-content;
    font-weight: 500;
  }
}
</style>
