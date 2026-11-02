<template>
  <!-- Main Grid Canvas Layout Viewport Grid -->
  <div class="kanban-canvas-grid-layout">
    
    <!-- 🟢 LANE 1: ACCEPTED COLUMN -->
    <div class="virtual-column-container" ref="acceptedViewport" @scroll="handleScroll('accepted')">
      <KanbanLane 
        lane-title="Accepted (Clean Bills)" 
        lane-key="accepted" 
        :claims-list="visibleAccepted"
      />
    </div>

    <!-- 🟡 LANE 2: PENDED COLUMN -->
    <div class="virtual-column-container" ref="pendedViewport" @scroll="handleScroll('pended')">
      <KanbanLane 
        lane-title="Pended (Under Review)" 
        lane-key="pended" 
        :claims-list="visiblePended"
      />
    </div>

    <!-- 🔴 LANE 3: REJECTED COLUMN -->
    <div class="virtual-column-container" ref="rejectedViewport" @scroll="handleScroll('rejected')">
      <KanbanLane 
        lane-title="Rejected (Errors)" 
        lane-key="rejected" 
        :claims-list="visibleRejected"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType } from 'vue';
import { ClaimCard } from '../utils/parser/types';
import KanbanLane from './KanbanLane.vue';

const props = defineProps({
  allClaims: {
    type: Array as PropType<ClaimCard[]>,
    required: true
  }
});

// Viewport Element References for Window Virtualization Triggers
const acceptedViewport = ref<HTMLElement | null>(null);
const pendedViewport = ref<HTMLElement | null>(null);
const rejectedViewport = ref<HTMLElement | null>(null);

// Estimated individual record matrix cell heights inside viewports
const CARD_HEIGHT_ESTIMATE = 190;
const VIEWPORT_BUFFER = 5;

// Scroll Tracker Index Points
const acceptedStartIndex = ref(0);
const pendedStartIndex = ref(0);
const rejectedStartIndex = ref(0);

// Separate and sort target items
const acceptedClaims = computed(() => props.allClaims.filter(c => c.lane === 'accepted'));
const pendedClaims = computed(() => props.allClaims.filter(c => c.lane === 'pended'));
const rejectedClaims = computed(() => props.allClaims.filter(c => c.lane === 'rejected'));

// Scenario 16 Fix: Virtualized sub-slicers drawing only active viewport metrics on demand
const visibleAccepted = computed(() => {
  const end = acceptedStartIndex.value + VIEWPORT_BUFFER + 8;
  return acceptedClaims.value.slice(acceptedStartIndex.value, end);
});

const visiblePended = computed(() => {
  const end = pendedStartIndex.value + VIEWPORT_BUFFER + 8;
  return pendedClaims.value.slice(pendedStartIndex.value, end);
});

const visibleRejected = computed(() => {
  const end = rejectedStartIndex.value + VIEWPORT_BUFFER + 8;
  return rejectedClaims.value.slice(rejectedStartIndex.value, end);
});

/**
 * Calculates current scroll positions dynamically to slide active virtual indices.
 */
function handleScroll(lane: 'accepted' | 'pended' | 'rejected') {
  if (lane === 'accepted' && acceptedViewport.value) {
    const calculatedIndex = Math.floor(acceptedViewport.value.scrollTop / CARD_HEIGHT_ESTIMATE);
    acceptedStartIndex.value = Math.max(0, calculatedIndex - VIEWPORT_BUFFER);
  }
  else if (lane === 'pended' && pendedViewport.value) {
    const calculatedIndex = Math.floor(pendedViewport.value.scrollTop / CARD_HEIGHT_ESTIMATE);
    pendedStartIndex.value = Math.max(0, calculatedIndex - VIEWPORT_BUFFER);
  }
  else if (lane === 'rejected' && rejectedViewport.value) {
    const calculatedIndex = Math.floor(rejectedViewport.value.scrollTop / CARD_HEIGHT_ESTIMATE);
    rejectedStartIndex.value = Math.max(0, calculatedIndex - VIEWPORT_BUFFER);
  }
}
</script>

<style scoped>
.kanban-canvas-grid-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  height: calc(100vh - 180px);
  width: 100%;
  margin-top: 20px;
}

.virtual-column-container {
  height: 100%;
  overflow-y: auto;
  border-radius: 12px;
}

/* Hide outer browser context track scrollbars while maintaining internal scroll events */
.virtual-column-container::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
</style>
