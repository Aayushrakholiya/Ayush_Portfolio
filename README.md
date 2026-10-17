<div align="center">

# ⚡ Ayush Rakholiya — Portfolio

**Full-stack developer crafting fast, animated, data-driven web experiences.**

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-ayushrakholiya.com-6E45E2?style=for-the-badge)](https://www.ayushrakholiya.com/)
[![Blog](https://img.shields.io/badge/📰_Daily_Three-/blog-FF6B35?style=for-the-badge)](https://www.ayushrakholiya.com/blog)

![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## ✨ Highlights

- 🎬 **Motion-first UI** — GSAP + Framer Motion animations, buttery smooth scrolling with Lenis
- 📰 **Daily Three newsletter** — a self-updating blog that publishes a fresh "top 3 from Hacker News" issue *every morning at 8:03 AM*, fully automated end-to-end
- 📬 **Working contact form** — serverless API on Vercel with a Supabase-backed inbox
- 📄 **Built-in resume page** with shareable file routing
- 🧭 **Custom 404 & coming-soon pages** — no dead ends
- 🪶 **Lightweight & fast** — Vite 7, React 19, code-split pages

## 🗂️ What's Inside

```text
src/
├── pages/        Home, About, Projects, Blog, Contact, Resume, 404
├── components/   Reusable UI building blocks
├── data/         Site data + 📰 daily newsletter issues (JSON, one per day)
├── hooks/        Custom React hooks
├── context/      Global state (Zustand + Context)
└── utils/        Helpers
api/contact/      Serverless contact endpoint (Vercel Functions)
supabase/         Database schema & setup
scripts/          Newsletter validation pipeline
tests/            Contact API + database tests
```

## 🚀 Run It Locally

```bash
git clone https://github.com/Aayushrakholiya/Ayush_Portfolio.git
cd Ayush_Portfolio
npm install
npm run dev        # start the dev server
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Validate newsletters + production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint across the project |
| `npm run test:contact` | Contact API + database tests |

## 📰 The Daily Three

The blog isn't hand-written — it ships itself. Every morning, an automated run fetches Hacker News' front page, picks the three best stories, and publishes a new issue as JSON. A validation script runs before every build, so a malformed issue can never break the site.

Curious? → [**Read today's issue**](https://www.ayushrakholiya.com/blog)

## 🛠️ Tech Stack

**Frontend** — React 19 · Vite 7 · Tailwind CSS 4 · GSAP · Framer Motion · Lenis · Zustand · TanStack Query · React Router 7
**Backend** — Vercel Serverless Functions · Supabase
**Quality** — ESLint 9 · Node test runner · custom newsletter validation pipeline

---

<div align="center">

⭐ Star the repo if you like what you see · [Get in touch](https://www.ayushrakholiya.com/contact)

</div>
