<div align="center">

# ⚡ AYUSH RAKHOLIYA

**Full-stack developer building fast, animated, data-driven web experiences.**

React · Vite · Tailwind · Supabase · Vercel

<br>

[![🌐 Live Site](https://img.shields.io/badge/Live_Site-ayushrakholiya.com-6E45E2?style=for-the-badge&labelColor=1a1a2e)](https://www.ayushrakholiya.com/)
[![📰 Blog](https://img.shields.io/badge/Blog-Daily_Three-FF6B35?style=for-the-badge&labelColor=1a1a2e)](https://www.ayushrakholiya.com/blog)
[![📬 Contact](https://img.shields.io/badge/Contact-Say_Hi-3FCF8E?style=for-the-badge&labelColor=1a1a2e)](https://www.ayushrakholiya.com/contact)

<br>

![React 19](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite 7](https://img.shields.io/badge/Vite_7-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=flat-square&logo=framer&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## 📌 Table of Contents

- [About](#-about)
- [Highlights](#-highlights)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [The Daily Three](#-the-daily-three)
- [Tech Stack](#-tech-stack)

## 👋 About

This is the codebase behind my personal portfolio — a production site, not a demo. It pairs a motion-heavy marketing front end with real backend plumbing: a serverless contact API, a Supabase database, and an automated blog pipeline that publishes new content every single morning.

**Visit it live → [ayushrakholiya.com](https://www.ayushrakholiya.com/)**

## ✨ Highlights

- 🎬 **Motion-first UI** — GSAP + Framer Motion animations with buttery Lenis smooth scrolling
- 📰 **Self-publishing blog** — the Daily Three newsletter ships a fresh "top 3 from Hacker News" issue every morning at 8:03 AM, fully automated end-to-end
- 📬 **Working contact form** — serverless API on Vercel with a Supabase-backed inbox
- 📄 **Built-in resume page** — served with tuned cache headers (`/resume/:file*`)
- 🧭 **No dead ends** — custom 404 and coming-soon pages
- 🪶 **Fast and lean** — Vite 7, React 19, code-split pages

## 🗂️ Project Structure

```text
Ayush_Portfolio/
├── src/
│   ├── pages/          Home · About · Projects · Blog · Contact · Resume · 404
│   ├── components/     Reusable UI building blocks
│   ├── data/           Site data + 📰 Daily Three issues (one JSON per day)
│   ├── hooks/          Custom React hooks
│   ├── context/        Global state (Zustand + Context)
│   └── utils/          Helpers
├── api/
│   └── contact/        Serverless contact endpoint (Vercel Functions)
├── supabase/           Database schema & setup
├── scripts/            Newsletter validation pipeline
├── tests/              Contact API + database tests
└── vercel.json         Routing & cache config
```

## 🚀 Getting Started

```bash
git clone https://github.com/Aayushrakholiya/Ayush_Portfolio.git
cd Ayush_Portfolio
npm install
npm run dev
```

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Validate newsletters + production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint across the project |
| `npm run test:contact` | Contact API + database tests |

## 📰 The Daily Three

> The blog isn't hand-written — it ships itself.

Every morning, an automated run reads Hacker News' front page, picks the three best stories, and publishes a new issue as JSON. A validation script gates every build, so a malformed issue can never break the site.

**7 issues shipped · 7 published on time**

Curious? → [**Read today's issue**](https://www.ayushrakholiya.com/blog)

## 🛠️ Tech Stack

| Layer | Tools |
| --- | --- |
| **Frontend** | React 19 · Vite 7 · Tailwind CSS 4 · GSAP · Framer Motion · Lenis · Zustand · TanStack Query · React Router 7 |
| **Backend** | Vercel Serverless Functions · Supabase |
| **Quality** | ESLint 9 · Node test runner · newsletter validation pipeline |

---

<div align="center">

⭐ **Star this repo if you like what you see** ⭐

Made with ☕ and late nights by [Ayush Rakholiya](https://www.ayushrakholiya.com/)

</div>
