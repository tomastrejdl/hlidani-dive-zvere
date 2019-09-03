<template id="calendar">
  <div class="calendar">
    <header class="header">
      <button @click="previousMonth">&lt;&lt;</button>
      <span>{{ currentMonthLabel }} {{ currentYear }}</span>
      <button @click="nextMonth">&gt;&gt;</button>
    </header>
    <div
      v-for="(dayLabel, index) in dayLabels"
      :key="dayLabel + index"
      class="headings"
    >
      {{ dayLabel }}
    </div>
    <div
      v-for="(day, index) in daysArray"
      :key="day + '-' + index"
      class="day"
      :class="dayClassObj(day)"
    >
      <button @click="setSelectedDate(day)">
        {{ day.date | formatDateToDay }}
      </button>
    </div>
  </div>
</template>

<script>
import * as dateFns from 'date-fns'
import { mod } from '@/misc/utils'

const DAY_LABELS = ['M', 'T', 'W', 'Th', 'F', 'S', 'S']
const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export default {
  filters: {
    formatDateToDay(val) {
      return dateFns.format(val, 'd')
    },
  },
  props: {
    startDate: {
      required: false,
      type: Date,
    },
  },
  data() {
    return {
      today: null,
      selectedDate: null,
      currDateCursor: null,
      dayLabels: null,
    }
  },
  computed: {
    currentMonth() {
      return this.currDateCursor.getMonth()
    },
    currentYear() {
      return this.currDateCursor.getFullYear()
    },
    currentMonthLabel() {
      return MONTH_LABELS[this.currentMonth]
    },
    daysArray() {
      const date = this.currDateCursor
      const startOfMonth = dateFns.startOfMonth(date)
      const endOfMonth = dateFns.endOfMonth(date)

      const days = dateFns
        .eachDayOfInterval({ start: startOfMonth, end: endOfMonth })
        .map(day => ({
          date: day,
          isCurrentMonth: dateFns.isSameMonth(
            new Date(this.currentYear, this.currentMonth),
            day,
          ),
          isToday: dateFns.isToday(day),
          isSelected: dateFns.isSameDay(this.selectedDate, day),
        }))

      // gen the days from last month
      let previousMonthCursor = dateFns.lastDayOfMonth(
        dateFns.addMonths(date, -1),
      )
      const begIndex = mod(dateFns.getDay(days[0].date) - 1, 7)
      for (let i = begIndex; i > 0; i--) {
        days.unshift({
          date: previousMonthCursor,
          isCurrentMonth: false,
          isToday: dateFns.isToday(previousMonthCursor),
          isSelected: dateFns.isSameDay(this.selectedDate, previousMonthCursor),
        })
        previousMonthCursor = dateFns.addDays(previousMonthCursor, -1)
      }

      // gen days for next month
      const daysNeededAtEnd = days.length % 7 > 0 ? 7 - (days.length % 7) : 0
      let nextMonthCursor = dateFns.addMonths(date, 1)
      nextMonthCursor = dateFns.setDate(nextMonthCursor, 1)
      for (let x = 1; x <= daysNeededAtEnd; x++) {
        days.push({
          date: nextMonthCursor,
          isCurrentMonth: false,
          isToday: dateFns.isToday(nextMonthCursor),
          isSelected: dateFns.isSameDay(this.selectedDate, nextMonthCursor),
        })
        nextMonthCursor = dateFns.addDays(nextMonthCursor, 1)
      }
      return days
    },
  },
  created() {
    this.dayLabels = DAY_LABELS.slice()
    this.today = new Date()
    this.selectedDate = this.today
    this.currDateCursor = this.today
  },
  mounted() {
    if (this.startDate) {
      this.currDateCursor = this.startDate
      this.selectedDate = this.startDate
    }
  },
  methods: {
    dayClassObj(day) {
      return {
        today: day.isToday,
        current: day.isCurrentMonth,
        selected: day.isSelected,
      }
    },
    nextMonth() {
      this.currDateCursor = dateFns.addMonths(this.currDateCursor, 1)
    },
    previousMonth() {
      this.currDateCursor = dateFns.addMonths(this.currDateCursor, -1)
    },
    setSelectedDate(day) {
      this.selectedDate = day.date
      this.$emit('input', this.selectedDate)
      // change calendar to correct month if they select previous or next month's days
      if (!day.isCurrentMonth) {
        const selectedMonth = dateFns.getMonth(this.selectedDate)
        this.currDateCursor = dateFns.setMonth(
          this.currDateCursor,
          selectedMonth,
        )
      }
    },
  },
  template: '#calendar',
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.calendar {
  background-color: $white;
  border-radius: 3px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  width: 100%;
  max-width: 30rem;
  padding: 1rem;

  > .header {
    padding: 0.75rem;
    font-size: 1.25rem;
    grid-column: 1 / span 7;

    > span {
      flex: 1;
      text-align: center;
    }

    button {
      border: none;
      background: $white;
      margin: 0 1rem;
      padding: 0.25rem 0.5rem;

      &:hover {
        background: $black-400;
        transition: background 150ms;
      }
    }
  }

  > * {
    align-items: center;
    display: flex;
    justify-content: center;
  }

  > .day {
    color: $black-200;
    font-size: 1rem;
    border-radius: 100%;
    cursor: pointer;

    &.selected {
      border: 1px solid $blue-grey-100;
    }

    &.current {
      color: $black-100;
    }

    &::before {
      content: '';
      display: inline-block;
      height: 0;
      padding-bottom: 100%;
      width: 1px;
    }

    button {
      color: inherit;
      background: transparent;
      border: none;
      height: 100%;
      width: 100%;

      &:hover {
        transition: background 150ms;
      }

      &:focus {
        outline: none;
      }
    }
  }

  > .today {
    background: $black-400;
  }
}

.text-center {
  text-align: center;
}
</style>
