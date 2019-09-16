<template>
  <div>
    <ion-header mode="ios">
      <ion-toolbar>
        <ion-title>Request petsitting</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="close()">
            <ion-icon slot="icon-only" name="star"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <ion-list>
        <ion-item v-for="(pet, index) in pets" :key="pet.id">
          <ion-label>{{ pet.displayName }}</ion-label>
          <ion-checkbox
            slot="end"
            :checked="index === 0"
            @ionChange="onChange(pet.id, $event.target.checked)"
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

      <ion-item>
        <ion-label position="floating">Note</ion-label>
        <ion-input
          @ionChange="onChange('note', $event.target.value)"
        ></ion-input>
      </ion-item>

      <div class="buttons">
        <ion-button fill="outline" color="dark" @click="close()">
          Cancel
        </ion-button>
        <ion-button fill="outline" color="primary" @click="closeWithData()">
          Save
        </ion-button>
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
      if (index === 0) this[pet.id] = true
      else this[pet.id] = false
    })
  },
  methods: {
    async closeWithData() {
      if (this.startDate === null) this.startDate = this.now
      if (this.startTime === null) this.startTime = this.now
      if (this.endDate === null) this.endDate = this.now
      if (this.endTime === null) this.endTime = this.nowPlusOneHour

      const pets = this.pets
        .filter(pet => this[pet.id] === true)
        .map(pet => pet.id)
      if (pets.length === 0) {
        await this.presentAlert('Choose at least one pet.')
        return
      }

      const from = concatDateAndTime(this.startDate, this.startTime)
      const to = concatDateAndTime(this.endDate, this.endTime)

      if (!dateFns.isAfter(to, from)) {
        await this.presentAlert('Start time cannot be after the end time.')
        return
      }

      const note = this.note || ''

      this.close({ pets, from, to, note })
    },
    onChange(inputName, value) {
      this[inputName] = value
    },
    presentAlert(message) {
      return this.$ionic.alertController
        .create({
          subHeader: message,
          buttons: ['OK'],
        })
        .then(a => a.present())
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
