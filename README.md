# 🎮 h5games space — Premium HTML5 Games Portal

h5games space is a high-performance, AdSense-ready HTML5 games aggregator portal built with Next.js 14 and Express. It automatically pulls open-source games from GitHub, categorizes them, and provides a polished interface for players to enjoy 1000+ titles with no login or downloads required.

## 🚀 Speed Features
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express, MongoDB, Redis Caching.
- **Data**: Automated GitHub API integration with smart filtering and categorization.
- **SEO**: Dynamic sitemaps, JSON-LD structured data, and optimized meta tags for every game.
- **Monetization**: Pre-configured AdSense placeholders and legal pages.

---

## 🛠️ Project Structure

```text
/frontend      - Next.js 14 Web App
/backend       - Express.js API & Crawler Scripts
```

---

## 🏁 Getting Started

### 1. Requirements
- Node.js 18+
- MongoDB instance (local or Atlas)
- Redis (optional, for caching)
- GitHub Personal Access Token (for the crawler)

### 2. Backend Setup
1. `cd backend`
2. `npm install`
3. Fill in `.env` (use `.env.example` as a template)
4. Seed admin: `npm run seed-admin`
5. Fetch games: `npm run fetch-games`
6. Start: `npm run dev`

### 3. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Fill in `.env.local`
4. Start: `npm run dev`

---

## 🐳 Deployment (Production)

- **Frontend**: Deploy to **Vercel** or **Netlify**.
- **Backend**: Deploy to **Railway**, **Render**, or any VPS.
- **Database**: Use **MongoDB Atlas** (Free tier supported).

---

## 🔒 Security
- JWT-based admin authentication.
- Rate limiting on all API routes.
- Input sanitization and MongoDB injection prevention.
- Content Security Policy (CSP) and Helmet security headers.

## 📄 License
This portal is designed for open-source games. Please respect individual repository licenses when using their content.
