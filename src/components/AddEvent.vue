<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="close()">
            <ion-icon slot="icon-only" name="star"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Request petsitting</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <ion-list>
        <ion-item v-for="(pet, index) in pets" :key="pet.id">
          <ion-label>{{ pet.displayName }}</ion-label>
          <ion-checkbox
            slot="end"
            :checked="index === 0"
            @ionChange="onChange(pet, $event.target.value)"
          ></ion-checkbox>
        </ion-item>
      </ion-list>

      <ion-item>
        <ion-label>From</ion-label>
        <ion-datetime
          display-format="DDD, DD MMM YYYY"
          :min="minDate"
          :max="maxDate"
          :value="now"
          @ionChange="onChange('startDate', $event.target.value)"
        ></ion-datetime>
        <ion-datetime
          display-format="HH:mm"
          minute-values="0,15,30,45"
          :value="now"
          @ionChange="onChange('startTime', $event.target.value)"
        ></ion-datetime>
      </ion-item>

      <ion-item>
        <ion-label>To</ion-label>
        <ion-datetime
          display-format="DDD, DD MMM YYYY"
          :min="minDate"
          :max="maxDate"
          :value="now"
          @ionChange="onChange('endDate', $event.target.value)"
        ></ion-datetime>
        <ion-datetime
          display-format="HH:mm"
          minute-values="0,15,30,45"
          :value="nowPlusOneHour"
          @ionChange="onChange('endTime', $event.target.value)"
        ></ion-datetime>
      </ion-item>

      <div class="buttons">
        <ion-button fill="outline" color="dark" @click="close()"
          >Cancel</ion-button
        >
        <ion-button fill="outline" color="primary" @click="closeWithData()"
          >Save</ion-button
        >
      </div>
    </ion-content>
  </div>
</template>

<script>
import * as dateFns from 'date-fns'

export default {
  name: 'Modal',
  props: {
    pets: { type: Array, default: () => [] },
    close: { type: Function, default: () => {} },
  },
  data() {
    return {
      content: 'Content',
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
    }
  },
  computed: {
    now: () => new Date().toISOString(),
    nowPlusOneHour: () => dateFns.addHours(new Date(), 1).toISOString(),
    minDate: () => dateFns.startOfToday().toISOString(),
    maxDate: () => dateFns.addYears(new Date(), 100).toISOString(),
  },
  created() {
    this.pets.forEach((pet, index) => {
      if (index === 0) this[pet] = true
      else this[pet] = false
    })
  },
  methods: {
    closeWithData() {
      if (this.startDate === null) this.startDate = this.now
      if (this.startTime === null) this.startTime = this.now
      if (this.endDate === null) this.endDate = this.now
      if (this.endTime === null) this.endTime = this.nowPlusOneHour

      this.close({
        pets: this.pets.filter(pet => this[pet] === true),
        from: concatDateAndTime(this.startDate, this.startTime),
        to: concatDateAndTime(this.endDate, this.endTime),
      })
    },
    onChange(inputName, value) {
      this[inputName] = value
    },
  },
}

function concatDateAndTime(dateString, timeString) {
  const date = new Date(dateString)
  const time = new Date(timeString)

  return new Date(
    date.getFullYear() +
      '-' +
      (date.getMonth() + 1) +
      '-' +
      date.getDate() +
      ' ' +
      time.getHours() +
      ':' +
      time.getMinutes(),
  )
}
</script>

<style lang="scss" scoped>
ion-content {
  height: calc(var(--height) - 56px);
}

.buttons {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
