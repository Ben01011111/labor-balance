<template>
  <div class="section" style="padding-top:18px;">
    <div class="sec-hd">
      <div class="sec-title">Staff Members</div>
      <!-- This triggers the StaffModal via App.vue's BottomNav -->
    </div>

    <div class="staff-list">
      <div
        class="staff-card"
        :class="{ expanded: expandedId === s.id }"
        v-for="(s, i) in staffList" :key="s.id"
      >
        <!-- Tap to expand/collapse -->
        <div class="staff-header" @click="toggle(s.id)">
          <div class="staff-avatar" :class="'av' + (i % 4)">{{ initials(s.name) }}</div>
          <div class="staff-name-row">
            <div class="staff-name">{{ s.name }}</div>
            <div class="staff-role">{{ s.role || 'Staff' }}</div>
          </div>
          <div class="sbc" :class="staffBalance(s.id) > 0 ? 'pos' : staffBalance(s.id) < 0 ? 'neg' : 'zero'">
            ₱{{ fmt(staffBalance(s.id)) }}
          </div>
          <div class="chevron" :class="{ open: expandedId === s.id }">▼</div>
        </div>

        <!-- Expanded detail -->
        <div class="staff-detail" v-if="expandedId === s.id">
          <div class="staff-stat-row">
            <div class="ss-item">
              <div class="ss-val" style="color:var(--gold)">₱{{ fmt(staffEarned(s.id)) }}</div>
              <div class="ss-label">Earned</div>
            </div>
            <div class="ss-item">
              <div class="ss-val" style="color:var(--green)">₱{{ fmt(staffPaid(s.id)) }}</div>
              <div class="ss-label">Paid</div>
            </div>
            <div class="ss-item">
              <div class="ss-val" style="color:var(--blue)">{{ staffJobCount(s.id) }}</div>
              <div class="ss-label">Jobs</div>
            </div>
          </div>
          <div class="staff-actions">
            <button class="sa-btn log"  @click="$emit('open-log-job', s.id)">🔨 Log Job</button>
            <button class="sa-btn pay"  @click="$emit('open-pay', s.id)">💳 Pay</button>
            <button class="sa-btn hist" @click="$emit('open-history', s.id)">📋 History</button>
          </div>
        </div>
      </div>

      <div class="empty" v-if="staffList.length === 0">
        <div class="empty-icon">👷</div>
        <div class="empty-text">No staff added yet.<br>Tap "Add Staff" below to begin.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from '../composables/useStore.js'

defineEmits(['open-log-job', 'open-pay', 'open-history'])

const { staffList, staffEarned, staffPaid, staffBalance, staffJobCount, fmt, initials } = useStore()

const expandedId = ref(null)

function toggle(id) {
  expandedId.value = expandedId.value === id ? null : id
}
</script>
