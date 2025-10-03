# SOC Concepts — Interactive Guide

> **An interactive, AI-enhanced web application for learning cybersecurity concepts.**

<img width="960" height="540" alt="image" src="https://github.com/user-attachments/assets/5ad6cae4-91af-48ad-a93a-c25a00ad92b8" />
<img width="953" height="500" alt="image" src="https://github.com/user-attachments/assets/abb0ba2e-21c4-4c5f-ac58-283003bf1d51" />
<img width="959" height="539" alt="image" src="https://github.com/user-attachments/assets/6e41e5d0-4244-45ce-968e-447b7c668fc9" />



## ✨ Overview

SOC Concepts is a small, single-page, static web application that delivers interactive cybersecurity learning guides. It pairs a rich, card-based learning UI with AI-powered explanations (via the Google Gemini API) and a full-featured admin CMS for creating and managing guides, topics, and user accounts — all saved locally in the browser using `localStorage`.

This project is intentionally lightweight: there is no server component required for the core app. It uses ES modules and an `importmap` to pull dependencies from CDNs, and it can be served with any static dev server (Vite is recommended for convenience and environment variable support).

---

## ✨ Core Features

* **Multiple Interactive Guides** — Pre-loaded guides include SOC Concepts, PowerShell, and Auditing. Add unlimited guides and topics.
* **Dynamic Content Management** — Admin dashboard to create/edit/delete guides, topics, and admin users.
* **AI-Powered Explanations** — Click the ✨ icon on any content block to open an explanation modal with both *Simple* and *Expert* modes (powered by Google Gemini via `@google/genai`).
* **Rich Content Formatting** — Supports headings, lists, highlighted blocks, colored text, tables, and more.
* **Local Persistence** — All data persists in the browser's `localStorage` (guides, cards, topics, users, settings).
* **Import / Export** — Backup and restore app state with a single JSON file.
* **Responsive Design** — Clean, mobile-friendly layout using Tailwind CSS.
* **Searchable Sidebar** — Quickly filter and navigate topics within a guide.

---

## 🚀 Tech Stack

* **Frontend:** React + TypeScript
* **Styling:** Tailwind CSS
* **AI Integration:** Google Gemini API (`@google/genai`) — optional; app works without it
* **Dev Server:** Vite (recommended) or any static server
* **Persistence:** `localStorage`

---

## 📁 Project Structure

```
.
├── data/               # Initial data for guides (socConcepts.ts, etc.)
├── components/         # Reusable UI components (Header, Sidebar, ExplanationModal)
├── layouts/            # Layout components (GuideLayout)
├── pages/              # Routes (HomePage, AdminDashboardPage, GuidePage)
├── index.html          # Main HTML entry with importmap
├── index.tsx           # React application root
├── App.tsx             # Routing and global state
└── types.ts            # TypeScript definitions
```

---

## ⚙️ Getting Started (Local)

### Prerequisites

* Node.js (recommended) and npm
* A modern web browser
* (Optional) Google Gemini API Key if you want AI explanations

### Recommended — Run with Vite

1. Install Vite globally (or use `npx`):

```bash
npm install -g vite
# or use npx: npx vite
```

2. Create a `.env` file in the project root and add your Gemini API key (Vite uses `import.meta.env`):

```bash
VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

> Important: In the code, access the key with `import.meta.env.VITE_API_KEY`. Replace any usage of `process.env.API_KEY` with the Vite style.

3. Start the dev server:

```bash
vite
```

4. Open the local URL shown by Vite (for example `http://localhost:5173`).

### Alternative — Any Static Server

You can serve the `index.html` with any static file server. Note that if you need environment variables (the Gemini API key), it’s easiest via Vite or a small Node script that injects the key at build time.

---

## 🔒 Admin Panel

* **Login page:** `/#/admin/login`
* **Default users** (development/testing only):

  * `admin` / `password`
  * `dq.adm` / `password`

> Change default credentials before any real usage.

### Admin Dashboard Features

* Create new guides (unique guide ID required).
* Edit existing guides and topics.
* Add / remove admin users.
* Export all app data to JSON.
* Import JSON to restore/overwrite the app state.
* Reset to the initial dataset included in the `data/` folder.

### Guide Editor

* Add new topics using a form or by editing the underlying JSON for each topic.
* Supports rich content blocks (json schema described below).
* Import/Export individual guide data.

---

## 📜 Content Data Model (example)

Each **Guide** contains: `id`, `title`, `description`, `coverImage?`, and a `topics` array.

Each **Topic** contains: `id`, `title`, `blocks` (an array of content blocks). A content block can be one of:

* `heading` — `{ type: 'heading', level: 1|2|3, text }`
* `paragraph` — `{ type: 'paragraph', text }`
* `highlight` — `{ type: 'highlight', text, color? }`
* `list` — `{ type: 'list', ordered?: boolean, items: string[] }`
* `table` — `{ type: 'table', headers: string[], rows: string[][] }`

This flexible block-based model allows creation of complex, styled lessons without code changes.

---

## 🤖 AI Integration

* The Explanation modal calls the Google Gemini API to generate *Simple* and *Expert* explanations for a selected block of content.
* Implementation notes:

  * Wrap calls with debouncing and rate-limiting client-side to avoid excessive requests.
  * Provide graceful fallbacks: if the API key is missing or the call fails, show a friendly message and offer a static explanation snippet.
  * Keep prompts small and focused; include the content block text and a short instruction (e.g., "Explain this in simple terms for beginners" or "Provide an expert-level deep dive with references").

---

## ✅ UX & Accessibility

* Responsive layout with keyboard navigable sidebar.
* Clear focus states and sufficient color contrast for readability.
* Modal dialog is accessible (focus trap, escape-to-close).

---

## 🔁 Import / Export

* **Export All Data:** Serializes `localStorage` keys used by the app to a single JSON file for backup.
* **Import Data:** Upload a previously exported JSON file to overwrite the current state. The import UI warns about overwriting existing data.

---

## 🧩 Extensibility & Customization

* Add new block types by extending the content renderer and the admin topic editor UI.
* Swap AI provider: abstract the AI client into a small adapter to support other providers (OpenAI, Anthropic, etc.).
* Replace `localStorage` with an API-backed persistence layer for multi-user or server-backed usage.

---

## 🛠 Development Tips

* Keep initial demo content under `data/` so `Reset to Default` can restore it.
* Use the browser devtools Application tab to inspect `localStorage` keys during development.
* Ensure any secret keys are injected at build/dev time — never commit `.env` to source control.

---

## 📦 License

MIT — feel free to reuse and extend.

---

If you want, I can also generate:

* A `vite` configuration for this single-file static app,
* A starter `index.html` with `importmap` and example `index.tsx`, or
* A sample `data/socConcepts.ts` initial dataset.

Tell me which one you’d like next and I’ll add it directly.
