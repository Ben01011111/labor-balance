<template>
  <div>
    <!-- ── Big balance card ── -->
    <div class="hero">
      <div class="balance-main">
        <div>
          <div class="bm-label">Total Unpaid Balance</div>
          <div class="bm-amount">
            <span class="prefix">₱</span>{{ fmt(totalUnpaid) }}
          </div>
        </div>
        <div class="bm-icon">{{ totalUnpaid > 0 ? '💰' : '✅' }}</div>
      </div>

      <!-- 4 stat cards -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="sc-label">Total Earned</div>
          <div class="sc-val g"><span class="sc-prefix">₱</span>{{ fmt(totalEarned) }}</div>
        </div>
        <div class="stat-card">
          <div class="sc-label">Total Paid Out</div>
          <div class="sc-val r"><span class="sc-prefix">₱</span>{{ fmt(totalPaid) }}</div>
        </div>
        <div class="stat-card">
          <div class="sc-label">Jobs Today</div>
          <div class="sc-val b">{{ todayJobs }}</div>
        </div>
        <div class="stat-card">
          <div class="sc-label">Active Staff</div>
          <div class="sc-val" style="color:var(--purple)">{{ staffList.length }}</div>
        </div>
      </div>
    </div>

    <!-- ── Period pills (Today / Week / Month) ── -->
    <div class="period-row">
      <div class="period-pill" v-for="p in periods" :key="p.label">
        <div class="pp-label">{{ p.label }}</div>
        <div class="pp-val">₱{{ fmt(p.earned) }}</div>
        <div class="pp-sub">{{ p.jobs }} job{{ p.jobs === 1 ? '' : 's' }}</div>
      </div>
    </div>

    <!-- ── Staff balance overview ── -->
    <div class="section">
      <div class="sec-hd">
        <div class="sec-title">Staff Balance Overview</div>
      </div>

      <div class="staff-list">
        <div
          class="staff-card"
          v-for="(s, i) in staffList" :key="s.id"
          @click="$emit('go-staff')"
          style="cursor:pointer"
        >
          <div class="staff-header">
            <div class="staff-avatar" :class="'av' + (i % 4)">{{ initials(s.name) }}</div>
            <div class="staff-name-row">
              <div class="staff-name">{{ s.name }}</div>
              <div class="staff-role">{{ s.role || 'Staff' }} · {{ staffJobCount(s.id) }} jobs</div>
            </div>
            <div class="sbc" :class="staffBalance(s.id) > 0 ? 'pos' : staffBalance(s.id) < 0 ? 'neg' : 'zero'">
              ₱{{ fmt(Math.abs(staffBalance(s.id))) }}
            </div>
          </div>
        </div>

        <div class="empty" v-if="staffList.length === 0">
          <div class="empty-icon">👥</div>
          <div class="empty-text">No staff yet. Add staff to begin.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from '../composables/useStore.js'

defineEmits(['go-staff'])

const {
  staffList, totalEarned, totalPaid, totalUnpaid,
  todayJobs, periods,
  staffBalance, staffJobCount,
  fmt, initials,
} = useStore()
</script>

<style scoped>
.hero { padding: 18px; }

.balance-main {
  background: linear-gradient(135deg, var(--card) 0%, var(--card2) 100%);
  border: 1px solid var(--gold);
  border-radius: 18px;
  padding: 20px 22px;
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px;
}
.bm-label  { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted2); margin-bottom: 6px; }
.bm-amount { font-family: 'JetBrains Mono', monospace; font-size: 34px; font-weight: 500; color: var(--gold); line-height: 1; }
.bm-amount .prefix { font-size: 16px; color: var(--muted2); margin-right: 2px; }
.bm-icon   { font-size: 32px; opacity: .8; }

.stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }

.period-row { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding: 0 18px 18px; }
.period-row::-webkit-scrollbar { display: none; }
.period-pill { flex-shrink: 0; background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 11px 14px; min-width: 105px; text-align: center; }
.pp-label { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); font-weight: 700; }
.pp-val   { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--gold); margin-top: 4px; }
.pp-sub   { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--muted); margin-top: 2px; }
</style>
