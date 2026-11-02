<template>
  <div class="kanban-lane-column">
    <!-- Lane Header Container Area -->
    <div class="lane-header-row" :class="`border-${laneKey}`">
      <div class="lane-title-group">
        <span class="status-indicator-dot" :class="laneKey"></span>
        <h3 class="lane-title-text">{{ laneTitle }}</h3>
      </div>
      <div class="lane-count-badge" :class="laneKey">
        {{ claimsList.length }}
      </div>
    </div>

    <!-- Scrollable Cards Canvas Node -->
    <div class="lane-cards-scroll-body">
      <div v-if="claimsList.length === 0" class="empty-lane-placeholder">
        <div class="placeholder-icon">📥</div>
        <p class="placeholder-text">No claims in this lane</p>
      </div>
      
      <div v-else class="cards-stack">
        <!-- Render Card Templates -->
        <KanbanCard 
          v-for="claim in claimsList" 
          :key="claim.id" 
          :card-data="claim" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { ClaimCard } from '../utils/parser/types';
import KanbanCard from './KanbanCard.vue';

defineProps({
  laneTitle: {
    type: String,
    required: true
  },
  laneKey: {
    type: String as PropType<'accepted' | 'pended' | 'rejected'>,
    required: true
  },
  claimsList: {
    type: Array as PropType<ClaimCard[]>,
    required: true
  }
});
</script>

<style scoped>
.kanban-lane-column {
  display: flex;
  flex-direction: column;
  background: rgba(20, 20, 25, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  height: 100%;
  min-height: 500px;
  overflow: hidden;
}

.lane-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(25, 25, 30, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

/* Header Lane Line Modifiers */
.border-accepted { border-bottom: 2px solid #00ff66; }
.border-pended { border-bottom: 2px solid #ffcc00; }
.border-rejected { border-bottom: 2px solid #ff3333; }

.lane-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.status-indicator-dot.accepted { background: #00ff66; box-shadow: 0 0 8px #00ff66; }
.status-indicator-dot.pended { background: #ffcc00; box-shadow: 0 0 8px #ffcc00; }
.status-indicator-dot.rejected { background: #ff3333; box-shadow: 0 0 8px #ff3333; }

.lane-title-text {
  color: #ffffff;
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.lane-count-badge {
  font-family: monospace;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  color: #a5a5b5;
}
.lane-count-badge.accepted { color: #00ff66; background: rgba(0, 255, 102, 0.08); }
.lane-count-badge.pended { color: #ffcc00; background: rgba(255, 204, 0, 0.08); }
.lane-count-badge.rejected { color: #ff3333; background: rgba(255, 51, 51, 0.08); }

.lane-cards-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

/* Custom Scrollbar styling for Obsidian dark panels */
.lane-cards-scroll-body::-webkit-scrollbar {
  width: 6px;
}
.lane-cards-scroll-body::-webkit-scrollbar-track {
  background: transparent;
}
.lane-cards-scroll-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.lane-cards-scroll-body::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}

.empty-lane-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  opacity: 0.25;
}

.placeholder-icon {
  font-size: 1.8rem;
  margin-bottom: 8px;
}

.placeholder-text {
  color: #b5b5c7;
  font-size: 0.8rem;
  margin: 0;
  text-align: center;
}

.cards-stack {
  display: flex;
  flex-direction: column;
}
</style>
