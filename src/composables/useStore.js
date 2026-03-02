import { ref, computed } from 'vue'

// Storage keys
const KS = 'lb_staff_v2'
const KE = 'lb_entries_v2'

// Load from localStorage
const load = (key) => {
  try { return JSON.parse(localStorage.getItem(key)) || [] }
  catch { return [] }
}

// Shared state (defined outside so all components share the same data)
const staffList = ref(load(KS))
const entries   = ref(load(KE))

export function useStore() {

  // Save both lists to localStorage
  const save = () => {
    localStorage.setItem(KS, JSON.stringify(staffList.value))
    localStorage.setItem(KE, JSON.stringify(entries.value))
  }

  // ── Helpers ──────────────────────────────────────────────
  const today = () => new Date().toISOString().split('T')[0]

  const fmt = (n) =>
    Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const fmtDate = (d) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })

  const initials = (name) =>
    name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()

  const jobLabel = (t) =>
    ({ wash: 'WASH', interior: 'INTERIOR', detail: 'DETAIL' })[t] || ''

  // ── Per-staff calculations ────────────────────────────────
  const staffEarned   = (id) => entries.value.filter(e => e.type === 'job'     && e.staffId === id).reduce((s, e) => s + e.amount, 0)
  const staffPaid     = (id) => entries.value.filter(e => e.type === 'payment' && e.staffId === id).reduce((s, e) => s + e.amount, 0)
  const staffBalance  = (id) => staffEarned(id) - staffPaid(id)
  const staffJobCount = (id) => entries.value.filter(e => e.type === 'job' && e.staffId === id).length

  // ── Global totals ─────────────────────────────────────────
  const totalEarned = computed(() =>
    entries.value.filter(e => e.type === 'job').reduce((s, e) => s + e.amount, 0)
  )
  const totalPaid = computed(() =>
    entries.value.filter(e => e.type === 'payment').reduce((s, e) => s + e.amount, 0)
  )
  const totalUnpaid = computed(() => totalEarned.value - totalPaid.value)

  const todayJobs = computed(() => {
    const t = today()
    return entries.value.filter(e => e.type === 'job' && e.date === t).length
  })

  // ── Period summaries (Today / This Week / This Month) ─────
  const getRange = (type) => {
    const now = new Date()
    if (type === 'day') {
      const s = new Date(now); s.setHours(0, 0, 0, 0)
      const e = new Date(now); e.setHours(23, 59, 59, 999)
      return [s, e]
    }
    if (type === 'week') {
      const s = new Date(now); s.setDate(now.getDate() - now.getDay()); s.setHours(0, 0, 0, 0)
      const e = new Date(s);   e.setDate(s.getDate() + 6);             e.setHours(23, 59, 59, 999)
      return [s, e]
    }
    return [
      new Date(now.getFullYear(), now.getMonth(), 1),
      new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    ]
  }

  const periodData = (type) => {
    const [s, e] = getRange(type)
    const jobs = entries.value.filter(en => {
      const d = new Date(en.date + 'T00:00:00')
      return en.type === 'job' && d >= s && d <= e
    })
    return { earned: jobs.reduce((t, j) => t + j.amount, 0), jobs: jobs.length }
  }

  const periods = computed(() => [
    { label: 'Today',      ...periodData('day')   },
    { label: 'This Week',  ...periodData('week')  },
    { label: 'This Month', ...periodData('month') },
  ])

  // ── Actions ───────────────────────────────────────────────
  const addJob = ({ staffId, jobType, rate, date, note }) => {
    entries.value.push({
      id: Date.now(),
      type: 'job',
      staffId,
      jobType,
      amount: parseFloat(rate),
      date,
      note: note.trim(),
    })
    save()
  }

  const addPayment = ({ staffId, amount, date, note }) => {
    entries.value.push({
      id: Date.now(),
      type: 'payment',
      staffId,
      amount: parseFloat(amount),
      date,
      note: note.trim(),
    })
    save()
  }

  const addStaff = ({ name, role }) => {
    staffList.value.push({ id: Date.now(), name: name.trim(), role })
    save()
  }

  const deleteEntry = (id) => {
    entries.value = entries.value.filter(e => e.id !== id)
    save()
  }

  return {
    // State
    staffList,
    entries,
    // Computed
    totalEarned,
    totalPaid,
    totalUnpaid,
    todayJobs,
    periods,
    // Per-staff
    staffEarned,
    staffPaid,
    staffBalance,
    staffJobCount,
    // Helpers
    today,
    fmt,
    fmtDate,
    initials,
    jobLabel,
    // Actions
    addJob,
    addPayment,
    addStaff,
    deleteEntry,
  }
}
