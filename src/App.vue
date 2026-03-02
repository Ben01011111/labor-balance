<template>
  <div id="app">

    <!-- Top header with tab switcher -->
    <AppHeader :tab="tab" @change-tab="tab = $event" />

    <!-- Main scrollable content -->
    <div class="page">
      <Dashboard v-if="tab === 'dashboard'" @go-staff="tab = 'staff'" />
      <StaffTab  v-if="tab === 'staff'"     @open-log-job="openLogJob" @open-pay="openPay" @open-history="openHistory" />
      <LogTab    v-if="tab === 'log'" />
    </div>

    <!-- Fixed bottom buttons -->
    <BottomNav
      @log-job="openLogJob(null)"
      @pay="openPay(null)"
      @add-staff="modal = 'staff'"
    />

    <!-- Modals — only one shows at a time -->
    <JobModal     v-if="modal === 'job'"     :preset-staff-id="presetStaffId" @close="modal = null" />
    <PayModal     v-if="modal === 'pay'"     :preset-staff-id="presetStaffId" @close="modal = null" />
    <StaffModal   v-if="modal === 'staff'"                                    @close="modal = null" />
    <HistoryModal v-if="modal === 'history'" :staff-id="presetStaffId"        @close="modal = null" />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader    from './components/AppHeader.vue'
import Dashboard    from './components/Dashboard.vue'
import StaffTab     from './components/StaffTab.vue'
import LogTab       from './components/LogTab.vue'
import BottomNav    from './components/BottomNav.vue'
import JobModal     from './components/modals/JobModal.vue'
import PayModal     from './components/modals/PayModal.vue'
import StaffModal   from './components/modals/StaffModal.vue'
import HistoryModal from './components/modals/HistoryModal.vue'

// Which tab is active: 'dashboard' | 'staff' | 'log'
const tab   = ref('dashboard')

// Which modal is open: null | 'job' | 'pay' | 'staff' | 'history'
const modal = ref(null)

// If a modal was opened for a specific staff member, their id goes here
const presetStaffId = ref(null)

function openLogJob(staffId) {
  presetStaffId.value = staffId
  modal.value = 'job'
}

function openPay(staffId) {
  presetStaffId.value = staffId
  modal.value = 'pay'
}

function openHistory(staffId) {
  presetStaffId.value = staffId
  modal.value = 'history'
}
</script>
