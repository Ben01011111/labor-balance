<template>
  <div class="section" style="padding-top:18px;">
    <div class="sec-hd">
      <div class="sec-title">All Entries</div>
      <select class="fi" style="padding:5px 10px;font-size:11px;width:auto;" v-model="logFilter">
        <option value="all">All</option>
        <option value="job">Jobs Only</option>
        <option value="payment">Payments Only</option>
      </select>
    </div>

    <div class="entry-list" v-if="filteredLog.length">
      <div class="entry-item" v-for="e in filteredLog" :key="e.id">
        <div class="ei-dot" :class="e.type"></div>
        <div class="ei-info">
          <div class="ei-top">
            <div class="ei-name">{{ e.staffName }}</div>
            <div class="ei-badge" :class="e.type === 'payment' ? 'payment' : e.jobType">
              {{ e.type === 'payment' ? 'PAYMENT' : jobLabel(e.jobType) }}
            </div>
          </div>
          <div class="ei-date">{{ fmtDate(e.date) }}{{ e.note ? ' · ' + e.note : '' }}</div>
        </div>
        <div class="ei-amount" :class="e.type">
          {{ e.type === 'job' ? '+' : '-' }}₱{{ fmt(e.amount) }}
        </div>
        <button class="ei-del" @click="confirmDelete(e.id)">✕</button>
      </div>
    </div>

    <div class="empty" v-else>
      <div class="empty-icon">📋</div>
      <div class="empty-text">No entries yet.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '../composables/useStore.js'

const { entries, staffList, fmt, fmtDate, jobLabel, deleteEntry } = useStore()

const logFilter = ref('all')

const filteredLog = computed(() => {
  // Sort newest first
  const sorted = [...entries.value].sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id)

  // Apply filter
  const filtered = logFilter.value === 'all' ? sorted : sorted.filter(e => e.type === logFilter.value)

  // Attach staff name for display
  return filtered.map(e => ({
    ...e,
    staffName: staffList.value.find(s => s.id === e.staffId)?.name || 'Unknown',
  }))
})

function confirmDelete(id) {
  if (confirm('Delete this entry?')) deleteEntry(id)
}
</script>
