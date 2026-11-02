# EDI 277 Track-X-Matrix Pipeline

An enterprise-grade, high-velocity parsing engine and virtualized tracking canvas designed to ingest raw, non-linear US Healthcare EDI 277 Claim Status files and translate them into an actionable, real-time Kanban interface.

---

## ⚡ Critical Pain Points in US Healthcare Reimbursement

US hospitals and healthcare networks operate under a highly complex, fragmented revenue cycle. When a facility submits medical bills (EDI 837 transactions) to insurance companies (payers), they enter an archaic communication bottleneck defined by the following systemic failures:

* **The Complete Black Box Visibility Crisis:** After billing files leave the hospital, revenue cycle teams are left completely in the dark. Payers frequently take 30 to 45 days to adjudicate claims. Without proactive intervention, hospitals have no way of knowing if a multi-million dollar batch has been successfully received, put on a verification hold, or permanently dropped.
* **The Cost of Undetected Early Rejections:** Payers generate automated electronic status updates called EDI 277 files. However, because these files are written in highly complex, deeply nested X12 data structures (HL loops), standard health information systems cannot easily read or parse them in real time. If a file contains a minor typo or an invalid Provider identifier, the entire transmission is rejected at the gate, but the error remains invisible until the hospital manually audits historical reports weeks later.
* **Severe Cash Flow and Revenue Leakage:** Delayed visibility directly chokes hospital operating capital. Claims that require minor corrections sit completely idle in payer systems. By the time administrative teams discover the root cause of the delay, the strict timely filing limits imposed by insurance payers have often expired, turning clean reimbursable claims into permanent write-offs.
* **Operational Burnout from Manual Auditing:** Medical billing staff are forced to spend thousands of manual hours pulling spreadsheets, logging into individual payer web portals one by one, or making phone calls to insurance reps just to check the status of simple transactions. This flat, tabular workflow scales terribly and introduces massive human error.

---

## 🚀 The Solution Matrix: What This Platform Achieves

**Track-X-Matrix** eliminates these bottlenecks by transforming unreadable, raw EDI 277 text streams into an instantaneous, visual operational command center:
* **Asynchronous File Ingestion:** Billing administrators drop complex EDI files directly into a secure browser interface for instant extraction.
* **Algorithmic State Translation:** Decodes hundreds of cryptic X12 HIPAA status codes into localized, plain-English definitions so billing teams can act within seconds.
* **Three-Tier Workflow Separation:** Automatically routes incoming claims into clear, functional swimlanes based on their real-time state:
  * 🟢 **Accepted:** Clean transactions that successfully passed the initial payer validation gates.
  * 🟡 **Pended:** Claims paused for active review (e.g., medical documentation requests or liability determinations).
  * 🔴 **Rejected:** Definitive errors requiring immediate correction and structural re-submission.

---

## 🛠️ The 16-Scenario Technical Reference Matrix

The underlying pipeline architecture is engineered using an isolated Strategy Pattern. Real-world edge cases are mitigated across four modular processing layers to prevent application crashes during heavy workloads.

### 1. Ingestion & Structural Tracking
* **Scenario 01: Dynamic Delimiter Shift** — Instantly discovers changing file segment dividers (`*`, `|`, `~`) inside `regexDiscoverer.ts` ahead of chunk splitting.
* **Scenario 02: Version Verification (5010 ⇄ 008060)** — Scales indexing offsets dynamically in `structuralPipeline.ts` when handling expanding element structures across different transaction generations.
* **Scenario 03: Payer Companion Shifting** — Isolates metadata boundaries using dynamic element signature lookup patterns rather than rigid, hardcoded index paths.
* **Scenario 04: Hierarchical Parent-Child Tree Tracking** — Builds an active, in-memory trace map via `hierarchyTree.ts` using parent pointers (`parentId`) to prevent data bleed between multi-doctor and multi-patient loops.

### 2. Status Processing & Boundary Protection
* **Scenario 05: Split Status Composite Decomposition** — Splits joined status composite codes (`STC*A1:20:PR`) cleanly into Category, Status, and Actor sub-arrays without mapping blind spots.
* **Scenario 06: Early-Drop Global Facility Rejections** — Uses look-ahead tracking in `statusDecomposer.ts` to flag terminal payer rejections directly at the Provider (`HL*2`) level before empty patient nodes crash the scraper.
* **Scenario 07: Shifting Date Layout Anomaly** — Leverages a multi-tier fallback scanner checking internal composite fields and raw `DTM` context frames concurrently to normalize timestamps.
* **Scenario 08: Ghost Claim Recovery** — Instantly builds compound recovery keys out of available demographic arrays if the patient-end identifier is completely stripped by the clearinghouse.

### 3. Advanced Reconciliation & Workflow Intelligence
* **Scenario 09: Multi-Procedure Line Splitting** — Stacks split sub-procedure elements as nested sub-task item arrays within a single Kanban card template to keep the interface highly organized.
* **Scenario 10: Virtual Trace Correlation** — Correlates incoming rows concurrently using active `TRN` and `REF*D9` cache indicators.
* **Scenario 11: Real-Time vs. Batch Delivery SLA Timing Drift** — Employs session-based boundary clearing on engine iterations to prevent real-time updates from corrupting batch states.
* **Scenario 12: Multi-Segment Status Cascade Overflow** — Transforms schema targets into array push collections to handle back-to-back cascading status updates seamlessly.

### 4. System Stabilization & High-Velocity Scaling
* **Scenario 13: Idempotent Payer Status Echo Deduplication** — Generates unique structural value hashes to block duplicate status files from creating ghost card allocations on the canvas.
* **Scenario 14: Hollow Loop Isolation** — Filters out empty text blocks missing vital patient criteria before UI allocation, preventing `TypeError` interface crashes.
* **Scenario 15: Dependent Hierarchy Loop-Shifting (HL3 ⇄ HL4)** — Walks up the loop tree structure contextually using level-independent queries to accurately map patient-to-subscriber relationship variables.
* **Scenario 16: DOM Window Thread Lock (50k Record Workloads)** — Implements pure-viewport window virtualization in `VirtualKanbanCanvas.vue`, rendering only the active visible rows to run tens of thousands of claims smoothly at 60 FPS without crashing the browser viewport.

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
