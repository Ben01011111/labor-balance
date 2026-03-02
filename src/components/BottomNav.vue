<template>
  <div class="bottom-nav">
    <button class="bn-btn job"   @click="$emit('log-job')">🔨 Log Job</button>
    <button class="bn-btn pay"   @click="$emit('pay')">💳 Pay Staff</button>
    <button class="bn-btn staff" @click="$emit('add-staff')">👷 Add Staff</button>
  </div>
</template>

<script setup>
defineEmits(['log-job', 'pay', 'add-staff'])
</script>

<style scoped>
.bottom-nav {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 430px;
  background: rgba(18,21,28,.96); backdrop-filter: blur(12px);
  border-top: 1px solid var(--border);
  display: flex; gap: 10px; padding: 10px 16px 22px; z-index: 50;
}
.bn-btn {
  flex: 1; padding: 13px; border-radius: 12px; border: none;
  font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px;
  transition: transform .1s;
}
.bn-btn:active  { transform: scale(.95); }
.bn-btn.job     { background: var(--gold);  color: #0a0c10; }
.bn-btn.pay     { background: var(--green); color: #0a0c10; }
.bn-btn.staff   { background: var(--card2); color: var(--text); border: 1px solid var(--border2); }
</style>
