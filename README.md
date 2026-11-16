# AdvisorFlow AI

AI-powered assistant for financial advisers that reduces post-meeting administration.

Turn raw client meeting notes into a structured, client-ready meeting package in seconds — no database, no permanent storage, demo-ready for pilot conversations.

---

## 🎯 Purpose

Financial advisers spend hours after every meeting writing summaries, action lists, and follow-up emails. AdvisorFlow AI automates that administration:

1. Adviser pastes meeting notes into a text box
2. Clicks **Generate Meeting Package**
3. OpenAI produces 8 structured sections (Client Summary, Discussion Points, Action Items, Documents, Risk Flags, Next Steps, Follow-Up Email, etc.)
4. Adviser copies, exports to PDF, or emails the output

Nothing is stored permanently. This is Version 1 — an MVP for demoing to advisers and converting into paid pilot projects.

---

## 🛠 Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **OpenAI API** (`gpt-4o-mini`)
- **Vercel-ready** deployment
- **lucide-react** icons
- **jspdf** + **html2canvas** (client-side PDF export)

---

## 📦 Installation

### 1. Clone / create the project

All project files live in this folder. No database setup required.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example env file:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your_actual_openai_api_key
```

Get an API key at: https://platform.openai.com/api-keys

### 4. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 🚀 Deployment to Vercel

### Option A: Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variable in Vercel dashboard or via CLI
vercel env add OPENAI_API_KEY
```

### Option B: GitHub Integration

1. Push this project to a GitHub repository
2. Connect the repository to Vercel
3. Add the `OPENAI_API_KEY` environment variable in the Vercel project settings
4. Deploy

Vercel auto-detects Next.js and configures the build settings automatically.

---

## 📁 Project Structure

```
advisorflow-ai/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # POST endpoint for OpenAI generation
│   ├── globals.css               # Tailwind + custom styles
│   ├── layout.tsx                # Root layout + metadata
│   └── page.tsx                  # Main page (client state + UI)
├── components/
│   ├── ui/
│   │   ├── button.tsx            # Reusable button with loading state
│   │   ├── card.tsx              # Reusable card variants
│   │   └── textarea.tsx          # Styled textarea
│   ├── landing/
│   │   └── hero.tsx              # Hero section
│   ├── input/
│   │   └── meeting-input.tsx     # Notes input + Load Demo
│   └── results/
│       ├── results-display.tsx   # Results container + layout
│       ├── section-card.tsx      # Individual section card
│       └── copy-export-buttons.tsx  # Copy + PDF export actions
├── lib/
│   ├── openai.ts                 # OpenAI client singleton
│   ├── prompt.ts                 # System prompt + user prompt builder
│   ├── pdf.ts                    # Client-side PDF export
│   └── utils.ts                  # cn() class merger
├── types/
│   └── index.ts                  # TypeScript interfaces
├── .env.example                  # Environment variable template
├── next.config.ts                # Next.js config
├── tailwind.config.ts            # Tailwind config (brand colors)
├── postcss.config.mjs            # PostCSS plugins
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies & scripts
└── README.md                     # This file
```

---

## 🔧 Architecture Notes

### Server-Side Prompt Engineering

The system prompt (`lib/prompt.ts`) instructs the model to act as an experienced CFP and financial planning practice administrator. Key constraints:

- **Never provide financial advice** — only summarise and organise
- **Compliant-aware** — flag documentation gaps without giving legal advice
- **Professional, clear, concise, client-friendly**
- Returns **strict JSON** matching the `MeetingPackage` interface

### API Route

`POST /api/generate` receives meeting notes, calls OpenAI, validates the JSON response, and returns the structured package. Includes error handling for missing API key, empty input, and malformed responses.

### Client-Side State

All state lives in React `useState` hooks in `app/page.tsx`:
- `meetingNotes` — raw input text
- `isLoading` — API call in progress
- `meetingPackage` — generated results
- `error` — error messages

No data is written to localStorage, cookies, or a database. Refreshing the page clears everything.

### PDF Export

Client-side only. Uses `html2canvas` to render the results section to an image, then `jspdf` to generate a downloadable PDF. Works entirely in the browser — no server round-trip.

---

## 🧪 Demo Data

Click **Load Demo** to insert a realistic financial planning meeting note:

> Met with Mr and Mrs Smith. Discussed retirement planning. Current living annuity value R3.2 million. Need to review beneficiary nominations. Spouse does not currently have a will. Client wants to retire within 2 years. Need updated FICA documents.

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#0A2540` | Headings, buttons, borders |
| Accent | `#00A3A3` | Highlights, icons, CTA buttons |
| Background | `#F8FAFC` | Page background |
| Surface | `#FFFFFF` | Cards, input fields |

Professional financial-services aesthetic: deep navy primary, teal accent, light gray backgrounds, generous whitespace, Inter typography.

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## ⚠️ Limitations (Version 1)

- No database — data is not persisted across page reloads
- No user authentication
- No multi-meeting history
- No CRM integration (output is copy/paste ready)
- Requires an OpenAI API key with sufficient quota

These are intentional scope boundaries for the MVP. The system is designed to be demonstrated live to advisers and then extended based on pilot feedback.

---

## 📄 License

Private — AdvisorFlow AI MVP.