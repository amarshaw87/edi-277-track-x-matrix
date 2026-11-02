<template>
  <div class="obsidian-app-container">
    <!-- Top Global Neon Tracking HUD Bar -->
    <header class="hud-top-bar">
      <div class="brand-section">
        <div class="neon-pulse-matrix"></div>
        <h1 class="app-title">TRACK-X-MATRIX // <span class="accent-text">EDI-277</span></h1>
      </div>
      
      <!-- Metrics Cards Row -->
      <div class="hud-metrics-row">
        <div class="metric-hud-card processed">
          <span class="hud-label">TOTAL CAPTURED</span>
          <span class="hud-value">{{ claims.length }}</span>
        </div>
        <div class="metric-hud-card accepted">
          <span class="hud-label">ACCEPTED METER</span>
          <span class="hud-value">₹{{ totalAcceptedAmount.toLocaleString('en-IN') }}</span>
        </div>
        <div class="metric-hud-card errors">
          <span class="hud-label">CRITICAL REJECTIONS</span>
          <span class="hud-value">{{ rejectedCount }}</span>
        </div>
      </div>
    </header>

    <!-- Interactive Drag-and-Drop Parsing Terminal Area -->
    <div 
      class="ingestion-dropzone-frame"
      :class="{ 'drag-active': isDragOver }"
      @dragover.prevent="toggleDragState(true)"
      @dragleave.prevent="toggleDragState(false)"
      @drop.prevent="handleFileDrop"
    >
      <div class="dropzone-internal-glow">
        <div class="terminal-prompt-row">
          <span class="terminal-caret">$&gt;</span>
          <p class="prompt-text-display">
            {{ statusMessage || "DROP RAW MESSY EDI 277 TEXT FILE HERE FOR REAL-TIME DECOMPOSITION TRANSLATION" }}
          </p>
        </div>
        <label class="custom-file-upload-btn">
          BROWSE FILES
          <input type="file" class="hidden-file-input" @change="handleManualFile" accept=".txt,.edi,.dat" />
        </label>
      </div>
    </div>

    <!-- Virtualized Visual Kanban Area Core Canvas Grid -->
    <main class="dashboard-canvas-workspace">
      <VirtualKanbanCanvas :all-claims="claims" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ClaimCard } from '../utils/parser/types';
import { Edi277ParserCore } from '../utils/edi277ParserCore';
import VirtualKanbanCanvas from './VirtualKanbanCanvas.vue';

const claims = ref<ClaimCard[]>([]);
const isDragOver = ref(false);
const statusMessage = ref('');

const parserEngine = new Edi277ParserCore();

// Financial metrics counters calculated reactively
const totalAcceptedAmount = computed(() => {
  return claims.value
    .filter(c => c.lane === 'accepted')
    .reduce((acc, curr) => acc + curr.procedures.reduce((pAcc, pCurr) => pAcc + pCurr.chargeAmount, 0), 0);
});

const rejectedCount = computed(() => {
  return claims.value.filter(c => c.lane === 'rejected').length;
});

function toggleDragState(active: boolean) {
  isDragOver.value = active;
}

/**
 * Handle files dropped into the neon viewport container
 */
function handleFileDrop(e: DragEvent) {
  toggleDragState(false);
  const file = e.dataTransfer?.files[0];
  if (file) readFileContent(file);
}

/**
 * Handle manual browsing input selection
 */
function handleManualFile(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) readFileContent(file);
}

/**
 * Reads data blocks out of local client storage targets
 */
function readFileContent(file: File) {
  statusMessage.value = `INGESTING: Processing parsing array loops for "${file.name}"...`;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    const rawText = event.target?.result as string;
    try {
      // Execute the structural processing pipeline matrix
      const processedResults = parserEngine.parse(rawText);
      claims.value = processedResults;
      statusMessage.value = `SUCCESS: Pipeline execution complete. Loaded ${processedResults.length} unique claims cleanly.`;
    } catch (err) {
      statusMessage.value = `CRITICAL FAILURE: Pipeline broken during matrix extraction loops. Ensure file is standard X12 format.`;
      console.error(err);
    }
  };
  reader.readAsText(file);
}
</script>

<style scoped>
.obsidian-app-container {
  min-height: 100vh;
  background-color: #0c0c0e;
  background-image: 
    radial-gradient(at 0% 0%, rgba(26, 21, 44, 0.3) 0, transparent 50%),
    radial-gradient(at 50% 0%, rgba(13, 31, 35, 0.2) 0, transparent 50%);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #e2e2e9;
}

.hud-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(18, 18, 22, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 16px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.neon-pulse-matrix {
  width: 100%;
  max-width: 10px;
  height: 10px;
  background: #00d2ff;
  border-radius: 50%;
  box-shadow: 0 0 10px #00d2ff, 0 0 20px #00d2ff;
  animation: pulse-glow 2s infinite ease-in-out;
}

@keyframes pulse-glow {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 14px #00d2ff, 0 0 25px #00d2ff; }
}

.app-title {
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: 1px;
  margin: 0;
}

.accent-text {
  color: #00d2ff;
  text-shadow: 0 0 10px rgba(0, 210, 255, 0.3);
}

.hud-metrics-row {
  display: flex;
  gap: 16px;
}

.metric-hud-card {
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.02);
  min-width: 120px;
}

.metric-hud-card.processed { border-left: 2px solid #00d2ff; }
.metric-hud-card.accepted { border-left: 2px solid #00ff66; }
.metric-hud-card.errors { border-left: 2px solid #ff3333; }

.hud-label {
  font-size: 0.6rem;
  color: #6e6e7e;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.hud-value {
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin-top: 2px;
}

.ingestion-dropzone-frame {
  background: rgba(14, 14, 18, 0.8);
  border: 2px dashed rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.6);
}

.ingestion-dropzone-frame.drag-active {
  border-color: #00d2ff;
  background: rgba(0, 210, 255, 0.03);
  box-shadow: 0 0 20px rgba(0, 210, 255, 0.1), inset 0 0 40px rgba(0, 210, 255, 0.05);
}

.dropzone-internal-glow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.terminal-prompt-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.terminal-caret {
  font-family: monospace;
  color: #00ff66;
  font-weight: 700;
  text-shadow: 0 0 6px rgba(0, 255, 102, 0.5);
}

.prompt-text-display {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: #a5a5b5;
  font-family: monospace;
}

.custom-file-upload-btn {
  background: #16161e;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;
}

.custom-file-upload-btn:hover {
  background: #22222e;
  border-color: #00d2ff;
  box-shadow: 0 0 12px rgba(0, 210, 255, 0.25);
}

.hidden-file-input {
  display: none;
}

.dashboard-canvas-workspace {
  flex: 1;
}
</style>
