<template>
  <div class="section" style="padding-top:18px;">
    <div class="sec-hd">
      <div class="sec-title">All Entries</div>
      <div style="display:flex; gap:8px; align-items:center;">
        <select class="fi" style="padding:5px 10px;font-size:11px;width:auto;" v-model="logFilter">
          <option value="all">All</option>
          <option value="job">Jobs Only</option>
          <option value="payment">Payments Only</option>
        </select>
        <button class="pdf-btn" @click="showPdfModal = true">
          GET PDF FILE 🧾
        </button>
      </div>
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

  <!-- PDF Month Picker Modal -->
  <div class="overlay" v-if="showPdfModal" @click.self="showPdfModal = false">
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-title job">Download <em>PDF</em></div>

      <div class="fg">
        <label class="fl">Select Month</label>
        <select class="fi" v-model="pdfMonth">
          <option value="all">All Months</option>
          <option v-for="m in availableMonths" :key="m.value" :value="m.value">
            {{ m.label }}
          </option>
        </select>
      </div>

      <div class="month-preview" v-if="pdfPreviewCount > 0">
        <span class="preview-count">{{ pdfPreviewCount }} record{{ pdfPreviewCount !== 1 ? 's' : '' }} found</span>
      </div>
      <div class="month-preview empty-preview" v-else>
        <span class="preview-count">No records for this month</span>
      </div>

      <button class="submit-btn job" @click="downloadPDF" :disabled="pdfPreviewCount === 0">
        Download PDF
      </button>
      <button class="cancel-btn" @click="showPdfModal = false">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '../composables/useStore.js'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const { entries, staffList, fmt, fmtDate, jobLabel, deleteEntry } = useStore()

const logFilter    = ref('all')
const showPdfModal = ref(false)
const pdfMonth     = ref('all')

// ── Main log list (for display) ───────────────────────────────────────────────
const filteredLog = computed(() => {
  const sorted   = [...entries.value].sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id)
  const filtered = logFilter.value === 'all' ? sorted : sorted.filter(e => e.type === logFilter.value)
  return filtered.map(e => ({
    ...e,
    staffName: staffList.value.find(s => s.id === e.staffId)?.name || 'Unknown',
  }))
})

// ── Available months from entries ─────────────────────────────────────────────
const availableMonths = computed(() => {
  const seen = new Set()
  entries.value.forEach(e => {
    const d = e.date.slice(0, 7) // "YYYY-MM"
    seen.add(d)
  })
  return [...seen]
    .sort((a, b) => b.localeCompare(a))
    .map(val => ({
      value: val,
      label: new Date(val + '-01').toLocaleDateString('en-PH', { year: 'numeric', month: 'long' }),
    }))
})

// ── Rows that will go into the PDF ────────────────────────────────────────────
const pdfRows = computed(() => {
  const sorted = [...entries.value].sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id)
  const byType = logFilter.value === 'all' ? sorted : sorted.filter(e => e.type === logFilter.value)
  const byMonth = pdfMonth.value === 'all'
    ? byType
    : byType.filter(e => e.date.slice(0, 7) === pdfMonth.value)
  return byMonth.map(e => ({
    ...e,
    staffName: staffList.value.find(s => s.id === e.staffId)?.name || 'Unknown',
  }))
})

const pdfPreviewCount = computed(() => pdfRows.value.length)

// ── Totals scoped to pdfRows ──────────────────────────────────────────────────
const scopedEarned  = computed(() => pdfRows.value.filter(e => e.type === 'job').reduce((s, e) => s + e.amount, 0))
const scopedPaid    = computed(() => pdfRows.value.filter(e => e.type === 'payment').reduce((s, e) => s + e.amount, 0))
const scopedUnpaid  = computed(() => scopedEarned.value - scopedPaid.value)

function confirmDelete(id) {
  if (confirm('Delete this entry?')) deleteEntry(id)
}

// ── PDF Export ────────────────────────────────────────────────────────────────
function downloadPDF() {
  const doc   = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const rows  = pdfRows.value

  const monthLabel = pdfMonth.value === 'all'
    ? 'All Months'
    : new Date(pdfMonth.value + '-01').toLocaleDateString('en-PH', { year: 'numeric', month: 'long' })

  // ── Title ───────────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(30, 30, 30)
  doc.text('Labor Balance', 14, 18)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(120, 120, 120)
  const genDate = new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
  doc.text(`Activity Log  ·  Generated: ${genDate}`, 14, 25)

  const filterLabel = logFilter.value === 'all' ? 'All Entries' : logFilter.value === 'job' ? 'Jobs Only' : 'Payments Only'
  doc.text(`Period: ${monthLabel}  ·  Filter: ${filterLabel}  ·  ${rows.length} record${rows.length !== 1 ? 's' : ''}`, 14, 31)

  // ── Divider ─────────────────────────────────────────────────────────────────
  doc.setDrawColor(220, 220, 220)
  doc.setLineWidth(0.4)
  doc.line(14, 35, pageW - 14, 35)

  // ── Summary row ─────────────────────────────────────────────────────────────
  const sumY = 40
  const colW = (pageW - 28) / 1
  const cards = [
    { label: 'Total Earned', value: scopedEarned.value  },
  ]
  cards.forEach((card, idx) => {
    const x = 14 + idx * colW
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(150, 150, 150)
    doc.text(card.label.toUpperCase(), x, sumY)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(30, 30, 30)
    doc.text(`P${fmt(card.value)}`, x, sumY + 7)
  })

  doc.setDrawColor(220, 220, 220)
  doc.setLineWidth(0.4)
  doc.line(14, sumY + 12, pageW - 14, sumY + 12)

  // ── Table ───────────────────────────────────────────────────────────────────
  const tableRows = rows.map(e => [
    fmtDate(e.date),
    e.staffName,
    e.type === 'payment' ? 'Payment' : jobLabel(e.jobType),
    e.note || '—',
    (e.type === 'job' ? '+' : '-') + 'P' + fmt(e.amount),
  ])

  autoTable(doc, {
    startY: sumY + 16,
    head: [['Date', 'Staff', 'Type', 'Note', 'Amount']],
    body: tableRows,
    theme: 'grid',
    styles: {
      font: 'helvetica', fontSize: 9,
      cellPadding: { top: 5, bottom: 5, left: 5, right: 5 },
      textColor: [40, 40, 40], lineColor: [220, 220, 220],
      lineWidth: 0.3, fillColor: [255, 255, 255],
    },
    headStyles: {
      fillColor: [245, 245, 245], textColor: [80, 80, 80],
      fontSize: 8, fontStyle: 'bold', halign: 'left', lineColor: [200, 200, 200],
    },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    columnStyles: {
      0: { cellWidth: 30 }, 1: { cellWidth: 40 }, 2: { cellWidth: 28 },
      3: { cellWidth: 'auto' }, 4: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
    },
    didParseCell(data) {
      if (data.section !== 'body') return
      const row = tableRows[data.row.index]
      if (!row) return
      if (data.column.index === 4) {
        data.cell.styles.textColor = row[4].startsWith('+') ? [34, 139, 34] : [200, 50, 50]
      }
    },
    foot: [[
      '', '', '',
      { content: 'Total Unpaid', styles: { fontStyle: 'bold', textColor: [60, 60, 60] } },
      { content: 'P' + fmt(scopedUnpaid.value), styles: { fontStyle: 'bold', halign: 'right', textColor: [34, 100, 34] } },
    ]],
    footStyles: {
      fillColor: [245, 245, 245], textColor: [80, 80, 80],
      fontSize: 9, lineColor: [200, 200, 200],
    },
  })

  // ── Page footer ─────────────────────────────────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.3)
    doc.line(14, pageH - 12, pageW - 14, pageH - 12)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(160, 160, 160)
    doc.text('Labor Balance — Confidential', 14, pageH - 7)
    doc.text(`Page ${i} of ${pageCount}`, pageW - 14, pageH - 7, { align: 'right' })
  }

  const stamp = pdfMonth.value === 'all' ? 'all' : pdfMonth.value
  doc.save(`labor-balance-${stamp}.pdf`)
  showPdfModal.value = false
}
</script>

<style scoped>
.pdf-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 12px; border-radius: 8px;
  border: 1px solid rgba(245, 200, 66, 0.35);
  background: rgba(245, 200, 66, 0.08); color: var(--gold);
  font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 700;
  cursor: pointer; transition: all 0.15s; white-space: nowrap;
}
.pdf-btn:hover { background: rgba(245, 200, 66, 0.15); border-color: var(--gold); }
.pdf-btn:active { transform: scale(0.95); }

.month-preview {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 10px; padding: 10px 14px; margin-bottom: 14px;
  text-align: center;
}
.month-preview.empty-preview { opacity: 0.5; }
.preview-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px; color: var(--gold);
}
.month-preview.empty-preview .preview-count { color: var(--muted2); }
</style>