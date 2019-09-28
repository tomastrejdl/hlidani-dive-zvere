<template id="calendar">
  <div class="calendar-wrapper">
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
        @click="setSelectedDate(day)"
      >
        {{ day.date | formatDateToDay }}
      </div>
      <div
        v-for="event in eventsArray"
        :key="`${event.id}-${event.eventPart}`"
        class="event"
        :class="eventClassObj(event)"
      >
        {{ event.eventPart }}
      </div>
    </div>
    <event-detail
      v-if="getSelectedDateEvent() !== null"
      :event="getSelectedDateEvent()"
    ></event-detail>
  </div>
</template>

<script>
import * as dateFns from 'date-fns'
import { mod } from '@/misc/utils'
import { mapState } from 'vuex'
import EventDetail from '@/components/event/EventDetail'

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
  components: { EventDetail },
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
      detailOpen: false,
    }
  },
  computed: {
    ...mapState('events', ['events']),
    currentMonth() {
      return this.currDateCursor.getMonth()
    },
    currentYear() {
      return this.currDateCursor.getFullYear()
    },
    currentMonthLabel() {
      return MONTH_LABELS[this.currentMonth]
    },
    eventsArray() {
      if (!this.events) return []
      const eventsArray = []

      this.events.forEach(event => {
        const eventDays = dateFns.eachDayOfInterval({
          start: event.from,
          end: event.to,
        })

        let weekStart = eventDays[0]
        let index = 0
        let eventPart = 1
        for (const day of eventDays) {
          if (!dateFns.isSameWeek(weekStart, day, { weekStartsOn: 1 })) {
            eventsArray.push({
              from: weekStart,
              to: eventDays[index - 1],
              id: event.id,
              eventPart: eventPart,
              fullEventData: event,
            })
            weekStart = day
            eventPart++
          }
          if (
            dateFns.isSameWeek(day, eventDays[eventDays.length - 1], {
              weekStartsOn: 1,
            })
          ) {
            eventsArray.push({
              from: day,
              to: eventDays[eventDays.length - 1],
              id: event.id,
              eventPart: eventPart,
              lastEventPart: true,
              fullEventData: event,
            })
            break
          }
          index++
        }
      })

      eventsArray.forEach(event1 => {
        eventsArray.forEach(event2 => {
          if (
            dateFns.areIntervalsOverlapping(
              { start: event1.from, end: event1.to },
              { start: event2.from, end: event2.to },
            )
          ) {
            if (!Object.is(event1, event2)) {
              if (!event1.displayOffset) event2.displayOffset = true
            }
          }
        })
      })

      return eventsArray
    },
    daysArray() {
      const date = this.currDateCursor
      const startOfMonth = dateFns.startOfMonth(date)
      const endOfMonth = dateFns.endOfMonth(date)

      let events = []
      if (this.events) {
        events = this.events
          .map(event =>
            dateFns
              .eachDayOfInterval({
                start: event.from,
                end: event.to,
              })
              .map(day => ({
                date: day,
                first: dateFns.isSameDay(day, event.from),
                last: dateFns.isSameDay(day, event.to),
                isCovered: event.isCovered,
                eventData: event,
              })),
          )
          .flat()
      }

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
          event: events.find(event => dateFns.isSameDay(event.date, day)),
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
          event: events.find(event =>
            dateFns.isSameDay(event.date, previousMonthCursor),
          ),
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
          event: events.find(event =>
            dateFns.isSameDay(event.date, nextMonthCursor),
          ),
        })
        nextMonthCursor = dateFns.addDays(nextMonthCursor, 1)
      }

      let index = 0
      for (let i = 3; i <= Math.ceil(days.length / 7) + 2; i++) {
        for (let j = 1; j <= 7; j++) {
          days[index].style = {
            row: i,
            column: j,
          }
          index++
        }
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
      const row = `grid-row-${day.style.row}`
      const column = `grid-column-${day.style.column}`
      return {
        today: day.isToday,
        current: day.isCurrentMonth,
        selected: day.isSelected,
        [row]: true,
        [column]: true,
      }
    },
    eventClassObj(event) {
      const eventStart = this.daysArray.find(day =>
        dateFns.isSameDay(day.date, event.from),
      )
      const eventEnd = this.daysArray.find(day =>
        dateFns.isSameDay(day.date, event.to),
      )

      if (!eventStart || !eventEnd) return { 'display-none': true }

      const row = `grid-row-${eventStart.style.row}`
      const columnStart = `grid-column-start-${eventStart.style.column}`
      const columnEnd = `grid-column-end-${eventEnd.style.column + 1}`
      return {
        [row]: true,
        [columnStart]: true,
        [columnEnd]: true,
        'is-covered': event.fullEventData.isCovered,
        'offset-top': event.displayOffset,
        'rounded-left': event.eventPart === 1,
        'rounded-right': event.lastEventPart,
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
    getSelectedDateEvent() {
      const event = this.daysArray.find(day =>
        dateFns.isSameDay(day.date, this.selectedDate),
      ).event

      if (event !== undefined) return event.eventData
      return null
    },
  },
  template: '#calendar',
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.calendar-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

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
    display: flex;
    justify-content: center;
  }

  > .day {
    color: $black-200;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 4px;
    background: content-box;
    -webkit-tap-highlight-color: transparent;

    &.selected {
      border: 2px dashed $black-100;
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

    &:hover {
      transition: background 150ms;
    }
  }

  > .today {
    background: $black-400;
  }

  > .event {
    height: 20px;
    margin-top: 22px;
    background-color: $danger-color;

    &.is-covered {
      background-color: $vue-color;
    }

    &.rounded-right {
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
    }

    &.rounded-left {
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
    }

    &.offset-top {
      margin-top: 44px;
    }

    &.display-none {
      display: none;
    }
  }
}

.text-center {
  text-align: center;
}

.grid-row {
  &-1 {
    grid-row: 1;
  }
  &-2 {
    grid-row: 2;
  }
  &-3 {
    grid-row: 3;
  }
  &-4 {
    grid-row: 4;
  }
  &-5 {
    grid-row: 5;
  }
  &-6 {
    grid-row: 6;
  }
  &-7 {
    grid-row: 7;
  }
  &-8 {
    grid-row: 8;
  }
  &-9 {
    grid-row: 9;
  }
  &-10 {
    grid-row: 10;
  }
}

.grid-column {
  &-1 {
    grid-column: 1;
  }
  &-2 {
    grid-column: 2;
  }
  &-3 {
    grid-column: 3;
  }
  &-4 {
    grid-column: 4;
  }
  &-5 {
    grid-column: 5;
  }
  &-6 {
    grid-column: 6;
  }
  &-7 {
    grid-column: 7;
  }
}

.grid-column-start {
  &-1 {
    grid-column-start: 1;
  }
  &-2 {
    grid-column-start: 2;
  }
  &-3 {
    grid-column-start: 3;
  }
  &-4 {
    grid-column-start: 4;
  }
  &-5 {
    grid-column-start: 5;
  }
  &-6 {
    grid-column-start: 6;
  }
  &-7 {
    grid-column-start: 7;
  }
}

.grid-column-end {
  &-1 {
    grid-column-end: 1;
  }
  &-2 {
    grid-column-end: 2;
  }
  &-3 {
    grid-column-end: 3;
  }
  &-4 {
    grid-column-end: 4;
  }
  &-5 {
    grid-column-end: 5;
  }
  &-6 {
    grid-column-end: 6;
  }
  &-7 {
    grid-column-end: 7;
  }
  &-8 {
    grid-column-end: 8;
  }
}
</style>
