<template>
  <div class="header">
    <div class="header-top">
      <div>
        <div class="app-name">Labor <em>Balance</em></div>
        <div class="header-date">{{ todayStr }}</div>
      </div>
      <div style="font-size:22px">🚗</div>
    </div>

    <!-- Tab switcher -->
    <div class="header-tabs">
      <button
        v-for="t in tabs" :key="t.value"
        class="htab"
        :class="{ active: tab === t.value }"
        @click="$emit('change-tab', t.value)"
      >
        {{ t.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  tab: { type: String, required: true }
})

// Emits
defineEmits(['change-tab'])

// Tab options
const tabs = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'staff',     label: 'Staff'     },
  { value: 'log',       label: 'Log'       },
]

const todayStr = computed(() =>
  new Date().toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric' })
)
</script>

<style scoped>
.header {
  position: sticky; top: 0; z-index: 50;
  background: rgba(10,12,16,0.94);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  padding: 16px 18px 14px;
  width: 100%;        /* ← add this */
  max-width: 430px;   /* ← add this */
}
.header-top { display: flex; justify-content: space-between; align-items: center; }
.app-name   { font-size: 18px; font-weight: 800; letter-spacing: -0.3px; }
.app-name em{ font-style: normal; color: var(--gold); }
.header-date{ font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted); margin-top: 3px; }

.header-tabs { display: flex; gap: 4px; margin-top: 12px; background: var(--card); border-radius: 10px; padding: 4px; }
.htab {
  flex: 1; padding: 7px 0; text-align: center;
  font-size: 12px; font-weight: 600; border-radius: 7px;
  cursor: pointer; transition: all .15s;
  color: var(--muted2); border: none; background: transparent;
  font-family: 'Outfit', sans-serif;
}
.htab.active { background: var(--card2); color: var(--text); box-shadow: 0 1px 4px rgba(0,0,0,.4); }
</style>
