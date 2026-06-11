# EcoPulse — Carbon Footprint Awareness Platform

EcoPulse is a full-stack web application designed to help individuals understand, track, and reduce their personal carbon footprint through activity logging, daily AI-powered insights, gamified challenges, and interactive charting.

---

## Folder Structure

```
ecopulse/
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/       # Navbar, CO2Gauge, ActivityCard, InsightTip, ChallengeCard
│   │   ├── pages/            # Login, Register, Onboarding, Dashboard, Log, Insights, Challenges, Offset
│   │   ├── context/          # Auth & Theme context
│   │   ├── utils/            # CO2 calculators and estimators
│   │   └── styles/           # Global CSS and Tailwind directives
├── server/                   # Node.js + Express backend
│   ├── routes/               # API endpoints
│   ├── controllers/          # Business logic handlers
│   ├── middleware/            # Auth guards, express-validator, Rate limiters
│   ├── services/             # Gemini AI SDK & carbon calculations
│   └── utils/                # JWT helpers and response formats
├── prisma/
│   └── schema.prisma         # Database schema for User, Activity, Goal, Challenge, UserChallenge, Offset
├── .env.example              # Template environment variables
└── README.md                 # Project guide
```

---

## Security Implementations

1. **Information Disclosure Prevention**: The `passwordHash` field is explicitly excluded from all User responses using Prisma `select` mappings.
2. **JWT Security**: The server issues standard `accessToken` (15-minute expiry) and `refreshToken` (7-day expiry) stored in secure, `httpOnly` cookies.
3. **Rate Limiting**: Incorporates `express-rate-limit` with a global limit of 100 requests per 15 minutes, and a strict limit of 5 requests per 15 minutes on `/auth` routes to block brute force attacks.
4. **Input Sanitization**: Express-validator enforces rules, formats, types, and escapes inputs on registers, activities, and baseline forms before running Prisma queries.
5. **Secure Headers**: Implements `Helmet.js` with structured Content Security Policies (CSP) to restrict scripts, styles, and image sources.
6. **CORS Constraints**: CORS is restricted strictly to the client origin specified in `.env` (`http://localhost:5173`).
7. **SQL Injection Guard**: Completely utilizes Prisma Client's parameterized queries instead of concatenated raw SQL query builders.
8. **AI proxy validation**: All Gemini prompts run server-side only. Client inputs are validated and sanitized before forwarding to the `@google/generative-ai` SDK.

---

## How to Run the Platform

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Ensure a database instance exists matching the `.env` database URL, or adjust the URL accordingly)

### Step 1: Backend Setup
1. Copy `.env.example` to `.env` and fill in your details (especially `GEMINI_API_KEY` for AI coaching tips):
   ```bash
   cp .env.example .env
   ```
2. Navigate to `server/` and install dependencies:
   ```bash
   cd server
   npm install
   ```
3. Sync the Prisma Database Schema:
   ```bash
   npx prisma migrate dev --name init --schema=../prisma/schema.prisma
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Step 2: Frontend Setup
1. Navigate to `client/` and install dependencies:
   ```bash
   cd client
   npm install
   ```
2. Launch the Vite dev server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## CO2 Emission Logic (Calculations)

- **Car travel**: 0.21 kg/km (petrol), 0.17 kg/km (diesel), 0.05 kg/km (electric)
- **Flight**: 0.255 kg/km (short haul <= 1500km), 0.195 kg/km (long haul > 1500km)
- **Diet daily**: Vegan 2.5 kg, Vegetarian 3.8 kg, Omnivore 5.5 kg, Heavy Meat 7.2 kg
- **Electricity**: 0.82 kg/kWh (India grid average), 0.23 kg/kWh (renewable grid)
- **New clothing item**: 10 kg per item
- **Online order**: 3 kg per delivery
- **Offsets**: Offsetting 1 Metric Ton = absorbs carbon equivalent to planting 45 mature trees.
