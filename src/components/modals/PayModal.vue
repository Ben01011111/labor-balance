<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-title pay">💳 Record <em>Payment</em></div>

      <div class="fg">
        <label class="fl">Date</label>
        <input class="fi pay" type="date" v-model="form.date" />
      </div>

      <div class="fg">
        <label class="fl">Staff Member</label>
        <div class="staff-select-grid">
          <button
            class="staff-sel-btn"
            :class="{ 'sel-pay': form.staffId === s.id }"
            v-for="s in staffList" :key="s.id"
            @click="form.staffId = s.id"
          >{{ s.name }}</button>
        </div>
        <div class="err" v-if="errors.staff">{{ errors.staff }}</div>
      </div>

      <!-- Show outstanding balance when staff is selected -->
      <div class="rate-display" v-if="form.staffId">
        <span class="rd-label">Outstanding Balance</span>
        <span class="rd-val">₱{{ fmt(staffBalance(form.staffId)) }}</span>
      </div>

      <div class="fg">
        <label class="fl">Amount to Pay (₱)</label>
        <input class="fi pay" type="number" v-model="form.amount" placeholder="0.00" min="1" inputmode="decimal" />
        <div class="err" v-if="errors.amount">{{ errors.amount }}</div>
      </div>

      <div class="fg">
        <label class="fl">Note (optional)</label>
        <input class="fi pay" type="text" v-model="form.note" placeholder="e.g. Weekly salary" />
      </div>

      <button class="submit-btn pay" @click="submit">✓ Save Payment</button>
      <button class="cancel-btn"     @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useStore } from '../../composables/useStore.js'

const props = defineProps({ presetStaffId: { type: Number, default: null } })
const emit = defineEmits(['close'])
const { staffList, staffBalance, addPayment, fmt, today } = useStore()

const form = reactive({ date: today(), staffId: props.presetStaffId, amount: '', note: '' })
const errors = reactive({ staff: '', amount: '' })

function submit() {
  errors.staff = ''; errors.amount = ''
  if (!form.staffId)                              { errors.staff  = 'Please select a staff member.';      return }
  const a = parseFloat(form.amount)
  if (!form.amount || isNaN(a) || a <= 0)         { errors.amount = 'Enter a valid amount greater than 0.'; return }
  addPayment({ staffId: form.staffId, amount: a, date: form.date, note: form.note })
  emit('close')
}
</script>
