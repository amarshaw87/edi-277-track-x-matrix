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

    <!-- Interactive Dual-Input Stream Panel and Progress Meter -->
    <div class="ingestion-dropzone-frame interactive-stream-grid">
      
      <!-- Left Panel: Real-time Paste Action Box -->
      <div class="stream-input-wrapper">
        <div class="input-header-row">
          <span class="terminal-caret">$&gt;</span>
          <label class="prompt-text-display">PASTE OR WRITE RAW EDI 277 CODE STREAM</label>
        </div>
        <textarea 
          v-model="rawCodeText" 
          @input="handleLiveTextParse"
          placeholder="Paste ISA*00*... string data here for instant background engine clearance"
          class="stream-code-textarea"
        ></textarea>
        
        <!-- Quick File Action Triggers as a Secondary Option -->
        <div class="alternative-action-footer">
          <span class="status-msg-log">{{ statusMessage || "System running idle. Awaiting X12 records..." }}</span>
          <label class="custom-file-upload-btn compact-btn">
            OR BROWSE FILE
            <input type="file" class="hidden-file-input" @change="handleManualFile" accept=".txt,.edi,.dat" />
          </label>
        </div>
      </div>

      <!-- Right Panel: Visual Processing Metrics Pipeline Bar Meter -->
      <div class="pipeline-progress-gauge">
        <div class="hud-label-gauge">ENGINE TRANSMISSION STATE</div>
        
        <!-- Reactive Meter Track Canvas -->
        <div class="meter-track-container">
          <div 
            :class="['meter-fill-bar', currentStateColor]" 
            :style="{ width: pipelineProgressPercentage + '%' }"
          ></div>
          <span class="meter-overlay-text">{{ progressStatusLabel }}</span>
        </div>

        <!-- Telemetry Data Output Logs -->
        <div class="telemetry-details">
          <div class="telemetry-row">
            <span>Envelope (ISA):</span>
            <span :class="hasIsaSegment ? 'text-green' : 'text-gray'">{{ hasIsaSegment ? 'DETECTED' : 'MISSING' }}</span>
          </div>
          <div class="telemetry-row">
            <span>Functional Group (GS):</span>
            <span :class="hasGsSegment ? 'text-green' : 'text-gray'">{{ hasGsSegment ? 'DETECTED' : 'MISSING' }}</span>
          </div>
        </div>
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
const statusMessage = ref('');
const rawCodeText = ref('');

const parserEngine = new Edi277ParserCore();

// Raw Text Stream Parsing Segment Telemetry Flags
const hasIsaSegment = computed(() => rawCodeText.value.includes('ISA*'));
const hasGsSegment = computed(() => rawCodeText.value.includes('GS*'));

/**
 * Calculates pipeline tracking steps dynamically based on detected segments
 */
const pipelineProgressPercentage = computed(() => {
  if (!rawCodeText.value.trim()) return 0;
  let score = 20; 
  if (hasIsaSegment.value) score += 30;
  if (hasGsSegment.value) score += 30;
  if (claims.value.length > 0) score += 20; 
  return score;
});

/**
 * Evaluates state strings to determine meter labeling configurations
 */
const progressStatusLabel = computed(() => {
  if (!rawCodeText.value.trim()) return "Waiting for Data Stream";
  if (claims.value.length > 0) return "Pipeline Clearance Verified";
  if (hasIsaSegment.value || hasGsSegment.value) return "Decomposing Segments...";
  return "Incomplete Structure";
});

/**
 * Evaluates tracking values to alternate color styles dynamically
 */
const currentStateColor = computed(() => {
  const percentage = pipelineProgressPercentage.value;
  if (percentage === 0) return 'state-idle';
  if (percentage === 100) return 'state-success';
  if (percentage < 60) return 'state-error';
  return 'state-warn';
});

// Financial metrics counters calculated reactively
const totalAcceptedAmount = computed(() => {
  return claims.value
    .filter(c => c.lane === 'accepted')
    .reduce((acc, curr) => acc + curr.procedures.reduce((pAcc, pCurr) => pAcc + pCurr.chargeAmount, 0), 0);
});

const rejectedCount = computed(() => {
  return claims.value.filter(c => c.lane === 'rejected').length;
});

/**
 * Processes text input transformations inside textarea instantly
 */
function handleLiveTextParse() {
  const codeContent = rawCodeText.value;
  if (!codeContent.trim()) {
    claims.value = [];
    statusMessage.value = '';
    return;
  }
  executePipelineParse(codeContent, "Live Code Stream");
}

/**
 * Handle manual browsing input selection
 */
function handleManualFile(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0]; // FIXED: Corrected syntax access index position
  if (file) {
    statusMessage.value = `INGESTING: Processing parsing array loops for "${file.name}"...`;
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawText = event.target?.result as string;
      rawCodeText.value = rawText; 
      executePipelineParse(rawText, file.name);
    };
    reader.readAsText(file);
  }
}

/**
 * Coordinates internal text strings with the Edi277ParserCore orchestration logic
 */
function executePipelineParse(rawText: string, sourceName: string) {
  try {
    const processedResults = parserEngine.parse(rawText);
    claims.value = processedResults;
    statusMessage.value = `SUCCESS: [${sourceName}] translated cleanly. Generated ${processedResults.length} records.`;
  } catch (err) {
    claims.value = []; 
    statusMessage.value = `CRITICAL FAILURE: Pipeline broken during matrix loops. Verify formatting layout.`;
    console.error(err);
  }
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
  width: 10px;
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

.interactive-stream-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

.ingestion-dropzone-frame {
  background: rgba(14, 14, 18, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.6);
}

.stream-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-header-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.terminal-caret {
  font-family: monospace;
  color: #00ff66;
  font-weight: 700;
  text-shadow: 0 0 6px rgba(0, 255, 102, 0.5);
}

.prompt-text-display {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #a5a5b5;
  font-family: monospace;
}

.stream-code-textarea {
  width: 100%;
  height: 110px;
  background: #060608;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 12px;
  font-family: monospace;
  font-size: 0.75rem;
  color: #00ff66;
  resize: none;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.stream-code-textarea:focus {
  border-color: #00d2ff;
}

.alternative-action-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.status-msg-log {
  font-family: monospace;
  font-size: 0.7rem;
  color: #8a8a9a;
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

.compact-btn {
  padding: 6px 12px;
  font-size: 0.65rem;
}

.hidden-file-input {
  display: none;
}

.pipeline-progress-gauge {
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hud-label-gauge {
  font-size: 0.65rem;
  color: #8a8a9a;
  font-weight: 700;
  font-family: monospace;
}

.meter-track-container {
  width: 100%;
  height: 28px;
  background: #060608;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.meter-fill-bar {
  height: 100%;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-idle { background: rgba(255, 255, 255, 0.05); }
.state-error { background: #ff3333; box-shadow: 0 0 15px rgba(255, 51, 51, 0.4); }
.state-warn { background: #ffaa00; box-shadow: 0 0 15px rgba(255, 170, 0, 0.4); }
.state-success { background: #00ff66; box-shadow: 0 0 15px rgba(0, 255, 102, 0.4); }

.meter-overlay-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-size: 0.65rem;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.telemetry-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.telemetry-row {
  display: flex;
  justify-content: space-between;
  font-family: monospace;
  font-size: 0.65rem;
  color: #6e6e7e;
}

.text-green { color: #00ff66; }
.text-gray { color: #44444a; }

.dashboard-canvas-workspace {
  flex: 1;
}

@media (max-width: 900px) {
  .interactive-stream-grid {
    grid-template-columns: 1fr;
  }
  .pipeline-progress-gauge {
    border-left: none;
    padding-left: 0;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    gap: 12px;
  }
}
</style>
