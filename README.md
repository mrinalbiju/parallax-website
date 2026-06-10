# NOVA — A Parallax Experience

A modern, single-page website built with **vanilla HTML, CSS and JavaScript** — no frameworks, no build step, zero image files.

## ✨ Effects included

- **Multi-speed scroll parallax** — layers move at different fractions of the scroll distance (`data-speed`), including counter-scrolling elements
- **Mouse parallax** — hero blobs and starfield react to cursor position (`data-mouse`)
- **Parallax background banners** — quote sections with drifting gradient backgrounds
- **3D tilt cards** — feature cards rotate toward the cursor in 3D space
- **Reveal-on-scroll animations** — IntersectionObserver-driven fade/slide-ins with stagger delays
- **Animated stat counters** — ease-out count-up when scrolled into view
- **Scroll progress bar**, **cursor glow**, **infinite marquee**, **CSS starfield**, **perspective grid floor**, **glassmorphism navbar**

All motion respects `prefers-reduced-motion`.

## 🚀 Run it

No build needed — just open `index.html`, or serve it:

```bash
npx serve .
# or
python3 -m http.server
```

## 📁 Structure

```
├── index.html
├── css/style.css
└── js/main.js
```

## 🌐 Deploy

Works out of the box on GitHub Pages, Netlify, Vercel or any static host.
