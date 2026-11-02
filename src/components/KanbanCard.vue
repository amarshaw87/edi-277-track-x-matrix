<template>
  <div 
    class="trackx-card"
    :class="`border-${cardData.lane}`"
  >
    <!-- Card Header Row -->
    <div class="card-header">
      <span class="patient-name">{{ cardData.patientName }}</span>
      <span :class="['status-badge', cardData.lane]">
        {{ cardData.globalStatus.category }}:{{ cardData.globalStatus.status }}
      </span>
    </div>

    <!-- Payer Metadata Details -->
    <div class="metadata-grid">
      <div class="meta-item">
        <span class="label">INSURANCE PAYER</span>
        <span class="value text-highlight">{{ cardData.payerName }}</span>
      </div>
      <div class="meta-item">
        <span class="label">TRACE IDENTIFIER</span>
        <span class="value text-mono">{{ cardData.traceId }}</span>
      </div>
    </div>

    <!-- Central Status Message Description Trigger -->
    <p class="status-description">
      {{ cardData.globalStatus.description }}
    </p>

    <!-- Scenario 09: Sub-Procedure Procedure Array Stacking Grid Container -->
    <div class="procedures-container">
      <div class="procedures-title">
        PROCEDURE BREAKDOWN ({{ cardData.procedures.length }})
      </div>
      
      <div 
        v-for="proc in cardData.procedures" 
        :key="proc.id" 
        class="procedure-row"
      >
        <div class="proc-code-cell">
          <span class="neon-dot"></span>
          <span class="text-mono">{{ proc.procedureCode }}</span>
        </div>
        <div class="proc-charge-cell">
          ₹{{ proc.chargeAmount.toLocaleString('en-IN') }}
        </div>
      </div>
    </div>

    <!-- Footer Meta Timestamp -->
    <div class="card-footer">
      <span class="time-label">UPDATED TIMESTAMP</span>
      <span class="time-value">{{ cardData.timestamp }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { ClaimCard } from '../utils/parser/types';

defineProps({
  cardData: {
    type: Object as PropType<ClaimCard>,
    required: true
  }
});
</script>

<style scoped>
.trackx-card {
  background: rgba(30, 30, 35, 0.65);
  backdrop-filter: blur(12px);
  border-left: 4px solid #3e3e4a;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-right: 1px solid rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}

.trackx-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45);
}

/* Lane Context Border Alerts */
.border-accepted { border-left-color: #00ff66; box-shadow: inset 5px 0 20px rgba(0, 255, 102, 0.02); }
.border-pended { border-left-color: #ffcc00; box-shadow: inset 5px 0 20px rgba(255, 204, 0, 0.02); }
.border-rejected { border-left-color: #ff3333; box-shadow: inset 5px 0 20px rgba(255, 51, 51, 0.02); }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.patient-name {
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
}

.status-badge {
  font-family: monospace;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-badge.accepted { background: rgba(0, 255, 102, 0.15); color: #00ff66; border: 1px solid rgba(0, 255, 102, 0.3); }
.status-badge.pended { background: rgba(255, 204, 0, 0.15); color: #ffcc00; border: 1px solid rgba(255, 204, 0, 0.3); }
.status-badge.rejected { background: rgba(255, 51, 51, 0.15); color: #ff3333; border: 1px solid rgba(255, 51, 51, 0.3); }

.metadata-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px;
  border-radius: 4px;
}

.label {
  display: block;
  font-size: 0.65rem;
  color: #8e8e9f;
  font-weight: 600;
  margin-bottom: 2px;
}

.value {
  font-size: 0.75rem;
  color: #d1d1de;
}

.text-highlight { color: #00d2ff; font-weight: 500; }
.text-mono { font-family: monospace; }

.status-description {
  font-size: 0.8rem;
  color: #b5b5c7;
  line-height: 1.4;
  margin: 0 0 14px 0;
}

/* Scenario 09 Internal Procedure Stack Styles */
.procedures-container {
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
  padding-top: 10px;
  margin-bottom: 12px;
}

.procedures-title {
  font-size: 0.65rem;
  color: #6e6e7e;
  font-weight: 700;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.procedure-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 6px;
  background: rgba(255, 255, 255, 0.02);
  margin-bottom: 4px;
  border-radius: 3px;
  font-size: 0.75rem;
}

.proc-code-cell {
  display: flex;
  align-items: center;
  color: #a5a5b5;
}

.neon-dot {
  width: 5px;
  height: 5px;
  background: #00d2ff;
  border-radius: 50%;
  margin-right: 6px;
  box-shadow: 0 0 6px #00d2ff;
}

.proc-charge-cell {
  color: #ffffff;
  font-weight: 600;
  font-family: monospace;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  padding-top: 8px;
  font-size: 0.65rem;
}

.time-label { color: #5a5a66; font-weight: 600; }
.time-value { color: #8e8e9f; font-family: monospace; }
</style>
