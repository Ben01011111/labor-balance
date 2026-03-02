<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-title job" style="font-size:17px;">
        📋 History — <em>{{ staffName }}</em>
      </div>

      <div class="entry-list" v-if="history.length">
        <div class="entry-item" v-for="e in history" :key="e.id">
          <div class="ei-dot" :class="e.type"></div>
          <div class="ei-info">
            <div class="ei-top">
              <div class="ei-badge" :class="e.type === 'payment' ? 'payment' : e.jobType">
                {{ e.type === 'payment' ? 'PAYMENT' : jobLabel(e.jobType) }}
              </div>
            </div>
            <div class="ei-date">{{ fmtDate(e.date) }}{{ e.note ? ' · ' + e.note : '' }}</div>
          </div>
          <div class="ei-amount" :class="e.type">
            {{ e.type === 'job' ? '+' : '-' }}₱{{ fmt(e.amount) }}
          </div>
        </div>
      </div>

      <div class="empty" v-else>
        <div class="empty-icon">📭</div>
        <div class="empty-text">No entries for this staff yet.</div>
      </div>

      <button class="cancel-btn" style="margin-top:16px;" @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '../../composables/useStore.js'

const props = defineProps({ staffId: { type: Number, default: null } })
defineEmits(['close'])

const { entries, staffList, fmt, fmtDate, jobLabel } = useStore()

const staffName = computed(() => staffList.value.find(s => s.id === props.staffId)?.name || '')

const history = computed(() =>
  entries.value
    .filter(e => e.staffId === props.staffId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
)
</script>
