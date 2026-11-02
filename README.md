# EDI 277 Track-X-Matrix Pipeline

An enterprise-grade, high-velocity translation engine and virtualized tracking canvas designed to parse messy US Healthcare EDI 277 Claim Status files into a beautiful, real-time Kanban layout.

---

## 💡 The Business Value Proposition 

In the United States healthcare infrastructure, hospitals send bills (EDI 837) to insurance companies and are often left completely in the dark. Billing teams wait weeks or months without knowing if a claim is clean, paused, or rejected. 

While insurance payers emit status tracking files called **EDI 277**, they are written in a dense, multi-layered corporate code language that standard developers and hospital workers cannot efficiently read. 

**Track-X-Matrix** bridges this critical gap. It functions as an **"Amazon Tracking Map for Medical Bills"**:
* **Instant Ingestion:** Drag-and-drop terminal swallows raw, messy X12 text chunks natively.
* **Hierarchical State Sorting:** Automatically unbraids nested loops (Payer ➔ Provider ➔ Subscriber ➔ Patient).
* **Automated Code Translation:** Converts 800+ cryptic HIPAA status markers into plain English.
* **Symphonic UX Viewport:** Eliminates flat, static spreadsheets in favor of an interactive, neon dark-mode Kanban board with Virtualized rendering optimized for massive production workloads.

---

## 🛠️ The 16-Scenario Reference Matrix

The pipeline architecture is engineered using an isolated Strategy Pattern. Real-world edge cases are mitigated across four processing layers, ensuring the engine remains fully extensible.

### 1. Ingestion & Structural Tracking
* **Scenario 01: Dynamic Delimiter Shift** — Instantly discovers shifting file delimiters (`*`, `|`, `~`) via `regexDiscoverer.ts` ahead of chunk splitting.
* **Scenario 02: Version Verification (5010 ⇄ 008060)** — Scales indexing offsets dynamically in `structuralPipeline.ts` when handling expanding element structures.
* **Scenario 03: Payer Companion Shifting** — Isolates targets dynamically using explicit metadata structural path indicators rather than rigid fixed-index locations.
* **Scenario 04: Hierarchical Parent-Child Tree Tracking** — Builds an active, in-memory trace map via `hierarchyTree.ts` using parent pointers to prevent cross-contamination between multi-doctor and multi-patient loops.

### 2. Status Processing & Boundary Protection
* **Scenario 05: Split Status Composite Decomposition** — Splits joined status composite variables (`STC*A1:20:PR`) cleanly into Category, Status, and Actor sub-arrays.
* **Scenario 06: Early-Drop Global Facility Rejections** — Uses look-ahead tracking in `statusDecomposer.ts` to flag total payer drops directly at the Provider (`HL*2`) level before empty patient nodes crash the scraper.
* **Scenario 07: Shifting Date Layout Anomaly** — Leverages a multi-tier fallback scanner checking internal composite fields and raw `DTM` context frames concurrently to normalize timestamps.
* **Scenario 08: Ghost Claim Recovery** — Instantly builds compound recovery keys out of available demographic arrays if the patient-end identifier is stripped.

### 3. Advanced Reconciliation & Workflow Intelligence
* **Scenario 09: Multi-Procedure Line Splitting** — Stacks split sub-procedure elements as nested sub-task item arrays within a single Kanban card template to eliminate screen flicker.
* **Scenario 10: Virtual Trace Correlation** — Correlates clearinghouse rows concurrently using active `TRN` and `REF*D9` cache indicators.
* **Scenario 11: Real-Time vs. Batch Delivery SLA Timing Drift** — Employs session-based boundary clearing on engine iterations to prevent real-time updates from corrupting batch states.
* **Scenario 12: Multi-Segment Status Cascade Overflow** — Transforms schema targets into array push collections to handle back-to-back cascading status updates seamlessly.

### 4. System Stabilization & High-Velocity Scaling
* **Scenario 13: Idempotent Payer Status Echo Deduplication** — Generates unique structural value hashes to block ghost cards from crowding the UI canvas.
* **Scenario 14: Hollow Loop Isolation** — Filters out empty text blocks missing vital patient criteria before UI allocation, preventing `TypeError` interface crashes.
* **Scenario 15: Dependent Hierarchy Loop-Shifting (HL3 ⇄ HL4)** — Walks up the loop tree structure contextually using level-independent queries to accurately map patient-to-subscriber relationship variables.
* **Scenario 16: DOM Window Thread Lock (50k Record Workloads)** — Implements pure-viewport window virtualization in `VirtualKanbanCanvas.vue`, rendering only the active visible rows to run tens of thousands of claims smoothly at 60 FPS.

---

## 📂 Architecture Map
```
src/
├── assets/
│   └── track277Dictionary.json  # 800+ Code dictionary translator schema
├── utils/
│   ├── parser/
│   │   ├── types.ts            # Strict core data model structures
│   │   ├── regexDiscoverer.ts  # Scenario 01: Dynamic separator scanning
│   │   ├── hierarchyTree.ts    # Scenarios 04/15: Core loop tracing maps
│   │   ├── statusDecomposer.ts # Scenarios 05/06: STC splitters & guards
│   │   └── fallbackScanner.ts  # Scenarios 07/10: Date & ghost recovery loops
│   ├── pipeline/
│   │   ├── structuralPipeline.ts     # Category 1 coordinator
│   │   ├── statusPipeline.ts         # Category 2 coordinator
│   │   ├── reconciliationPipeline.ts # Category 3 coordinator
│   │   └── stabilizationPipeline.ts  # Category 4 coordinator
│   └── edi277ParserCore.ts     # Central engine orchestrator framework
├── components/
│   ├── ObsidianDashboard.vue    # Full dark-hud framework & drag-drop terminal
│   ├── VirtualKanbanCanvas.vue # Scenario 16: Ultra-high velocity scroller
│   ├── KanbanLane.vue          # Modular structural stage columns
│   └── KanbanCard.vue          # Scenario 09: Sub-task procedure line stack
```
---

## 🚀 Local Installation & Setup

Ensure you have [Node.js](https://nodejs.org) installed on your machine.

### 1. Clone and Install Dependencies
```bash
git clone https://github.com
cd edi-277-track-x-matrix
npm install
```

### 2. Launch Local Development Server
```bash
npm run dev
```
The application will automatically spin up an Obsidian dark-mode dashboard at `http://localhost:3000`.

### 3. Verify via Ingestion Testing
Drag and drop the bundled `mock_claim_status_277.txt` file directly into the terminal dropzone view to watch the processing pipelines instantly translate and load the claims into the virtualized board.

### 4. Production Compilation
```bash
npm run build
```

---
**Reference Architect:** Amar Shaw
