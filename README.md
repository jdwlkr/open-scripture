# Open Scripture 📖✨

**Open Scripture** is an open-source, high-performance web application designed for deep scripture research, cross-reference mapping, and knowledge graph exploration across the entire Bible.

Powered by the **Open Knowledge Format (OKF)** engine, Open Scripture structures scripture passages (all 66 books of the Old and New Testaments) and cross-reference networks into an interactive, client-side knowledge graph with IndexedDB offline persistence.

![Open Scripture Architecture](https://img.shields.io/badge/Open--Scripture-OKF%201.0-6366f1?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/React-18-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=for-the-badge)

---

## 🌟 Key Features

- 📑 **Dual-Pane Research Workbench**: Read scripture on the left panel with interactive verse selection, font scaling, and live cross-reference badge counters; inspect OKF knowledge nodes and cross-references on the right.
- 🕸️ **Interactive SVG OKF Knowledge Graph**: Render verse interconnections visually with radial node placement, category color coding, zoom/pan controls, and 1st/2nd degree subnet depth filters.
- 📊 **Parallel Passage Viewer**: Side-by-side comparative reader allowing simultaneous viewing and synchronization of up to 3 passages across Old and New Testaments.
- 🔍 **Instant Full-Text Search**: Search across all 66 books by keyword, topic tag, or verse reference ID (`GEN.1.1`, `JHN.3.16`) with `Ctrl+K` / `Cmd+K` keyboard shortcut support.
- 🏷️ **Categorized Cross-References & Weights**: Treasury of Scripture Knowledge (TSK) connections pre-parsed into 5 OKF categories with confidence weight scores (1–5 scale):
  - 💗 `direct_quote` (Weight 5) — Direct quotation across Testaments or books
  - 💜 `prophecy_fulfillment` (Weight 5) — Old Testament prophecy fulfilled in the New Testament
  - 💙 `parallel_account` (Weight 4) — Parallel story or Gospel harmony
  - 💚 `topical_echo` (Weight 3) — Shared theological theme or concept
  - 💛 `linguistic_link` (Weight 2) — Key Hebrew/Greek root word metaphor
- 📝 **Personal Study Notes & Bookmarks**: Add research notes, tag insights, and bookmark verses with offline browser storage via IndexedDB.
- 📦 **OKF JSON Schema Export/Import**: Download or upload complete cross-reference graphs and study annotations in standardized OKF JSON schema format.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18 + Vite 6
- **Language**: TypeScript
- **Styling**: Modern Vanilla CSS (Tailored dark/light mode palettes, glassmorphism, typography scales with *Newsreader* serif & *Outfit* sans)
- **Data & Storage**: IndexedDB via `idb` for offline persistence & sub-millisecond graph queries
- **Icons**: Lucide React

---

## 🚀 Quickstart & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Setup
```bash
# Clone the repository
git clone https://github.com/jdwlkr/open-scripture.git
cd open-scripture

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

### Production Build
```bash
# Type check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🧩 Open Knowledge Format (OKF) Data Schema

Open Scripture uses standardized OKF JSON data structures:

```typescript
export interface OKFVerseNode {
  id: string;             // e.g. "GEN.1.1" or "JHN.3.16"
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  tags?: string[];
}

export interface OKFCrossRefEdge {
  id: string;
  sourceVerseId: string;
  targetVerseId: string;
  category: 'direct_quote' | 'prophecy_fulfillment' | 'parallel_account' | 'topical_echo' | 'linguistic_link';
  weight: number;         // 1 to 5
  note?: string;
}
```

---

## 📂 Project Structure

```
open-scripture/
├── index.html              # Entry HTML with Google Fonts & SEO metadata
├── src/
│   ├── components/         # React UI Components
│   │   ├── Header.tsx            # Navigation, view mode switcher & controls
│   │   ├── ScriptureReader.tsx   # Main scripture reading pane
│   │   ├── InspectorPanel.tsx    # OKF Knowledge Node & Cross-Ref Inspector
│   │   ├── GraphVisualizer.tsx   # Interactive SVG Knowledge Graph
│   │   ├── ParallelView.tsx      # Multi-passage comparative reader
│   │   ├── SearchModal.tsx       # Full-text & reference search modal
│   │   └── OKFExporter.tsx       # OKF JSON export/import modal
│   ├── data/               # Bible books metadata & TSK cross-reference seeds
│   │   ├── bibleData.ts          # 66 Bible books metadata & text generator
│   │   └── crossRefData.ts       # Treasury of Scripture Knowledge OKF edges
│   ├── services/           # Services & Storage Logic
│   │   ├── db.ts                 # IndexedDB store initialization & queries
│   │   └── okfEngine.ts          # Graph traversal, schema export/import logic
│   ├── types/              # OKF TypeScript interfaces
│   │   └── okf.ts
│   ├── App.tsx             # Root application orchestrator
│   ├── index.css           # Design system & modern CSS variables
│   └── main.tsx            # React DOM entry point
├── package.json
├── tsconfig.json
└── vite.config.js
```

---

## 📜 License

MIT License — free for open study, research, and non-commercial/commercial scripture visualization tools.
