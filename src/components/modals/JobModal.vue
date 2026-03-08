<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-title job"> Log <em>Job</em></div>

      <div class="fg">
        <label class="fl">Date</label>
        <input class="fi" type="date" v-model="form.date" />
      </div>

      <div class="fg">
        <label class="fl">Staff Member</label>
        <div class="staff-select-grid">
          <button
            class="staff-sel-btn"
            :class="{ 'sel-job': form.staffId === s.id }"
            v-for="s in staffList" :key="s.id"
            @click="form.staffId = s.id"
          >{{ s.name }}</button>
        </div>
        <div class="err" v-if="errors.staff">{{ errors.staff }}</div>
      </div>

      <div class="fg">
        <label class="fl">Job Type</label>
        <div class="job-types">
          <button class="jt-btn" :class="{ sel: form.jobType === 'wash' }"     @click="form.jobType = 'wash'"> Full Wash</button>
        </div>
        <div class="err" v-if="errors.type">{{ errors.type }}</div>
      </div>

      <div class="fg">
        <label class="fl">Labor Rate Per Job (₱)</label>
        <input class="fi" type="number" v-model="form.rate" placeholder="e.g. 150" min="1" inputmode="decimal" />
        <div class="err" v-if="errors.rate">{{ errors.rate }}</div>
      </div>

      <div class="fg">
        <label class="fl">Note (optional)</label>
        <input class="fi" type="text" v-model="form.note" placeholder="e.g. Toyota Vios" />
      </div>

      <button class="submit-btn job" @click="submit">+ Save Job Entry</button>
      <button class="cancel-btn"     @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useStore } from '../../composables/useStore.js'

const props = defineProps({ presetStaffId: { type: Number, default: null } })
const emit = defineEmits(['close'])
const { staffList, addJob, today } = useStore()

const form = reactive({ date: today(), staffId: props.presetStaffId, jobType: null, rate: '', note: '' })
const errors = reactive({ staff: '', type: '', rate: '' })

function submit() {
  errors.staff = ''; errors.type = ''; errors.rate = ''
  if (!form.staffId)                         { errors.staff = 'Please select a staff member.';      return }
  if (!form.jobType)                         { errors.type  = 'Please select a job type.';          return }
  const r = parseFloat(form.rate)
  if (!form.rate || isNaN(r) || r <= 0)      { errors.rate  = 'Enter a valid rate greater than 0.'; return }
  addJob({ staffId: form.staffId, jobType: form.jobType, rate: r, date: form.date, note: form.note })
  emit('close')
}
</script>
