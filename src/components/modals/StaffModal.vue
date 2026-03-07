<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-title staff">👷 Add <em>Staff</em></div>

      <div class="fg">
        <label class="fl">Full Name</label>
        <input class="fi staff" type="text" v-model="form.name" placeholder="e.g. Juan dela Cruz" />
        <div class="err" v-if="errors.name">{{ errors.name }}</div>
      </div>

      <div class="fg">
        <label class="fl">Role</label>
        <select class="fi staff" v-model="form.role">
          <option value="">Select role...</option>
          <option value="Washer & Detailer">Washer & Detailer</option>
        </select>
      </div>

      <button class="submit-btn staff" @click="submit">+ Add Staff Member</button>
      <button class="cancel-btn"       @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useStore } from '../../composables/useStore.js'

const emit = defineEmits(['close'])
const { addStaff } = useStore()

const form   = reactive({ name: '', role: '' })
const errors = reactive({ name: '' })

function submit() {
  errors.name = ''
  if (!form.name.trim()) { errors.name = 'Please enter a name.'; return }
  addStaff({ name: form.name, role: form.role })
  emit('close')
}
</script>
