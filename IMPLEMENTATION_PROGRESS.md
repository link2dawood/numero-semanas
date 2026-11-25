# Implementation Progress — NumeroSemanas Expansion

**Last Updated:** 2026-11-25  
**Objective:** Expand numerosemanas.es into a complete Spanish-language calendar and date-calculation platform.

---

## Phase 2 — Individual Week Pages ✅ COMPLETE

**URL Structure:** `/semana/{week}/{year}` (e.g., `/semana/48/2026`)

| Task | Status |
|------|--------|
| Create `/semana/[n]/[year]/page.tsx` | ✅ Done |
| H1 with week and year | ✅ Done |
| Monday–Sunday date range | ✅ Done |
| Current/past/future status indicator | ✅ Done |
| 7-day calendar grid | ✅ Done |
| Spanish day names | ✅ Done |
| Week number and ISO year | ✅ Done |
| Spanish public holidays in week | ✅ Done |
| Previous/next week navigation | ✅ Done |
| Link to yearly calendar | ✅ Done |
| Link to week calculator | ✅ Done |
| Explanatory content | ✅ Done |
| Week-specific FAQs | ✅ Done |
| Unique title/description | ✅ Done |
| Canonical URL | ✅ Done |
| Breadcrumb navigation | ✅ Done |
| BreadcrumbList JSON-LD | ✅ Done |
| Static generation (ISR) | ✅ Done |
| Sitemap updated | ✅ Done |

**Pages Generated:** 835 pages (2020–2035, respecting 52/53 week years)

**Files Created/Modified:**
- `src/app/semana/[n]/[year]/page.tsx` — New year-specific week pages
- `src/app/semana/[n]/page.tsx` — Updated with year selector
- `src/app/sitemap.ts` — Added week/year routes

---

## Phase 0 — Audit ✅ COMPLETE

| Task | Status | Notes |
|------|--------|-------|
| Inspect project structure | ✅ Done | Next.js 15, React 19, TypeScript, Tailwind 4 |
| Identify framework/routing | ✅ Done | App Router with dynamic routes |
| Review existing implementations | ✅ Done | Spanish-only site (no Finnish/English versions) |
| Inspect homepage/header/footer | ✅ Done | Full components in `/components/` |
| Check SEO metadata | ✅ Done | JSON-LD, OpenGraph, sitemap.ts, robots.ts |
| Identify reusable components | ✅ Done | 20+ components available |
| Check responsive design | ✅ Done | Mobile-first with Tailwind |
| Identify URLs to preserve | ✅ Done | Documented in audit report |

---

## Phase 1 — Spanish ISO 8601 Calendar System ✅ COMPLETE

### Core Functions

| Function | Status | Location |
|----------|--------|----------|
| Get ISO week number from date | ✅ Done | `src/lib/weeks.ts` → `isoWeek()` |
| Get ISO week-numbering year | ✅ Done | `src/lib/weeks.ts` → `isoWeek().year` |
| Get Monday of ISO week | ✅ Done | `src/lib/weeks.ts` → `mondayOf()` |
| Get Sunday of ISO week | ✅ Done | `addDays(monday, 6)` |
| Number of ISO weeks in year | ✅ Done | `src/lib/weeks.ts` → `weeksInYear()` |
| Get all ISO weeks for year | ✅ Done | `src/lib/weeks.ts` → `isoWeeksForYear()` |
| Convert week+year to date range | ✅ Done | `src/lib/week-calendar.ts` → `getWeekRows()` |
| Handle leap years | ✅ Done | `isLeapYear()` internal function |
| Handle year boundaries | ✅ Done | Tested in `weeks.test.ts` |

### ISO 8601 Rules Compliance

| Rule | Status | Verified By |
|------|--------|-------------|
| Week starts Monday | ✅ | `mondayOf()` returns Monday |
| Week ends Sunday | ✅ | `addDays(monday, 6)` |
| Week 1 contains Jan 4 | ✅ | Test: "Jan 4 always in week 1" |
| Week 1 contains first Thursday | ✅ | Algorithm uses Thursday rule |
| 52 or 53 weeks per year | ✅ | `weeksInYear()` tested |
| Dec dates can be week 1 of next year | ✅ | N/A for 2026-2027 boundary |
| Jan dates can be week 52/53 of prev year | ✅ | Test: "Jan 1, 2027 → W53 2026" |

### Boundary Test Cases

| Case | Expected | Status |
|------|----------|--------|
| Week 48 of 2026 | Nov 23–29, 2026 | ✅ Pass |
| Week 53 of 2026 | Dec 28, 2026 – Jan 3, 2027 | ✅ Pass |
| Jan 1, 2027 | ISO week 53 of 2026 | ✅ Pass |
| Week 1 of 2027 | Jan 4–10, 2027 | ✅ Pass |

### Unit Tests

| Test File | Tests | Status |
|-----------|-------|--------|
| `weeks.test.ts` | 8 | ✅ Pass |
| `holidays.test.ts` | 66 | ✅ Pass |
| `sun.test.ts` | 5 | ✅ Pass |
| `moon.test.ts` | 3 | ✅ Pass |
| `structured-data.test.ts` | 4 | ✅ Pass |
| `inline-links.test.ts` | 5 | ✅ Pass |
| `payments.test.ts` | 3 | ✅ Pass |
| **Total** | **94** | ✅ All Pass |

---

## Phase 3 — Date Calculators ✅ COMPLETE

| Calculator | Route | Status |
|------------|-------|--------|
| Days between dates | `/calculadora-dias-entre-fechas` | ✅ Done |
| Add/subtract days | `/calculadora-sumar-dias` | ✅ Done |
| Days until New Year | `/dias-hasta-ano-nuevo` | ✅ Done |
| Days until Summer | `/dias-hasta-verano` | ✅ Done |

**Components Created:**
- `src/components/calculators/DaysBetweenCalculator.tsx`
- `src/components/calculators/AddDaysCalculator.tsx`
- `src/components/calculators/NewYearCountdown.tsx`
- `src/components/calculators/SummerCountdown.tsx`

**Features:**
- Interactive date inputs with real-time calculation
- Days, weeks, business days breakdown
- ISO week number and parity display
- Live countdowns with seconds
- Summer: astronomical vs meteorological options
- Mobile-responsive design
- Spanish FAQs and explanatory content
- JSON-LD structured data (WebApplication)
- Sitemap updated

---

## Phase 5 — Planners & Additional Calculators ✅ COMPLETE

| Tool | Route | Features |
|------|-------|----------|
| Vacation Planner | `/planificador-vacaciones` | Working days, holidays in range, long weekends, efficiency score |
| Working Hours Calculator | `/calculadora-horas-trabajo` | Daily/weekly/monthly hours, break time, schedule presets |
| Project Planner | `/planificador-proyectos` | Milestones, weekly breakdown, ISO week planning |

**Components Created:**
- `src/components/calculators/VacationPlanner.tsx`
- `src/components/calculators/WorkingHoursCalculator.tsx`
- `src/components/calculators/ProjectPlanner.tsx`

**Pages Created:**
- `src/app/planificador-vacaciones/page.tsx`
- `src/app/calculadora-horas-trabajo/page.tsx`
- `src/app/planificador-proyectos/page.tsx`

---

## Remaining Calculators (from footer-pages.ts placeholders)

| Calculator | Route | Status |
|------------|-------|--------|
| Days calculator | `/calculadora-dias` | ⚠️ Placeholder (use `/calculadora-dias-entre-fechas`) |
| Weeks calculator | `/calculadora-semanas` | ❌ Pending |
| Age calculator | `/calculadora-edad` | ❌ Pending |
| Vacation calculator | `/calculadora-vacaciones` | ⚠️ Placeholder (use `/planificador-vacaciones`) |
| Days until Christmas | `/dias-hasta-navidad` | ❌ Pending |

---

## Phase 4 — Spanish Holiday Calendar ✅ COMPLETE

| Page Type | Route Pattern | Pages Generated |
|-----------|---------------|-----------------|
| National holidays by year | `/festivos/[year]` | 9 pages (2020-2028) |
| Individual holidays | `/festivos/[year]/[holiday]` | 90 pages |
| Regional holidays | `/festivos/[community]/[year]` | 171 pages |

**Features:**
- National holidays with BOE source citations
- All 19 autonomous communities supported
- 10 individual holiday pages per year (Año Nuevo, Reyes, Viernes Santo, etc.)
- Year-to-year comparison tables
- Verified/projected status indicators
- Mobile-responsive tables
- Breadcrumb navigation
- JSON-LD Event structured data
- Redirects from old URLs (/festivos-2026 → /festivos/2026)

**Files Created:**
- `src/app/festivos/[year]/page.tsx` — National holidays by year
- `src/app/festivos/[year]/[holiday]/page.tsx` — Individual holiday pages
- `src/app/festivos/[community]/[year]/page.tsx` — Regional holidays
- `src/app/festivos/[community]/page.tsx` — Redirect to current year

**Updated:**
- `src/lib/redirects.ts` — Added holiday URL redirects
- `src/app/sitemap.ts` — Added 270 holiday routes

---

## Remaining Holiday-Related Pages

| Page | Route | Status |
|------|-------|--------|
| Bridge days 2026 | `/puentes-2026` | ❌ Pending |
| Bridge days 2027 | `/puentes-2027` | ❌ Pending |
| School holidays | `/vacaciones-escolares` | ❌ Pending |
| Working days 2027 | `/dias-laborables-2027` | ❌ Pending |

---

## Phase 4 — Astronomy & Calendar Pages ❌ NOT STARTED

| Page | Route | Current State | Action Needed |
|------|-------|---------------|---------------|
| Day length | `/duracion-del-dia` | Placeholder | Extend sun.ts with day length |
| DST 2027 | `/cambio-hora-2027` | Placeholder | Add 2027 DST dates |
| Winter solstice | `/solsticio-invierno` | Placeholder | Add solstice calculation |
| Santoral | `/santoral` | Placeholder | Requires saints database |

---

## Phase 5 — SEO & Performance ❌ NOT STARTED

| Task | Status | Priority |
|------|--------|----------|
| Internal linking between related pages | ❌ Pending | HIGH |
| Expand FAQ per-page | ❌ Pending | MEDIUM |
| Add BreadcrumbList JSON-LD | ⚠️ Partial | MEDIUM |
| Performance audit | ❌ Pending | LOW |
| Core Web Vitals check | ❌ Pending | LOW |

---

## Existing Pages Status

### Core Pages ✅ Working

| Route | Description |
|-------|-------------|
| `/` | Homepage with current week |
| `/semanas-2026` | 2026 weeks list |
| `/lista-semanas-2027` | 2027 weeks list |
| `/calendario-2027` | 2027 calendar view |
| `/semana/[n]` | Individual week pages (1-53) |
| `/semanas/[year]` | Year weeks (2020-2035) |
| `/calendario/[year]` | Year calendar (2020-2035) |
| `/widget` | Embeddable widget generator |
| `/api/pdf/semanas-2027` | PDF download |
| `/api/v1/semana` | JSON API |
| `/amanecer-atardecer/{city}` | Sunrise/sunset by city |

### Footer Pages ✅ Working (indexable: true)

| Route | Description |
|-------|-------------|
| `/festivos-2026` | National holidays 2026 |
| `/festivos-2027` | National holidays 2027 |
| `/numeros-de-semana` | ISO week number info |
| `/cuantas-semanas-tiene-un-anio` | Weeks in a year |
| `/semanas-pares-e-impares` | Even/odd weeks |
| `/calendario-imprimible` | Printable calendar |
| `/suscripcion-calendario` | Calendar subscription |
| `/gestion-del-tiempo` | Time management |
| `/dias-de-cobro-2026` | Payday dates 2026 |
| `/pagos-sepe-2026` | SEPE payments 2026 |
| `/pago-pensiones-2026` | Pension payments 2026 |
| `/cambio-de-hora-2026` | DST change 2026 |
| `/fases-luna-2026` | Moon phases 2026 |
| `/amanecer-atardecer` | Sunrise/sunset hub |
| `/widget-numero-semana` | Widget embed page |
| `/datos-abiertos` | Open data |
| `/metodologia` | Methodology |
| `/fuentes` | Data sources |
| `/sobre-nosotros` | About us |
| `/principios-editoriales` | Editorial principles |
| `/contacto` | Contact form |
| `/aviso-legal` | Legal notice |
| `/terminos-de-uso` | Terms of use |
| `/politica-de-privacidad` | Privacy policy |
| `/devoluciones` | Refund policy |
| `/politica-de-cookies` | Cookie policy |
| `/extension-chrome` | Chrome extension |

### Footer Pages ❌ PENDING (indexable: false)

These pages exist but have placeholder content only:

| Route | Description | Priority |
|-------|-------------|----------|
| `/calculadora-dias` | Days calculator | HIGH |
| `/calculadora-semanas` | Weeks calculator | HIGH |
| `/calculadora-edad` | Age calculator | HIGH |
| `/calculadora-vacaciones` | Vacation calculator | MEDIUM |
| `/dias-hasta-navidad` | Days until Christmas | MEDIUM |
| `/dias-laborables` | Working days | MEDIUM |
| `/dias-laborables-2027` | Working days 2027 | MEDIUM |
| `/festivos-por-comunidad` | Regional holidays | MEDIUM |
| `/vacaciones-escolares` | School holidays | MEDIUM |
| `/puentes-2026` | Bridge days 2026 | MEDIUM |
| `/puentes-2027` | Bridge days 2027 | MEDIUM |
| `/calendario-laboral` | Work calendar | LOW |
| `/calendario-mensual` | Monthly calendar | LOW |
| `/calendario-imprimible-2026` | 2026 printable | LOW |
| `/duracion-del-dia` | Day length | LOW |
| `/cambio-hora-2027` | DST 2027 | LOW |
| `/solsticio-invierno` | Winter solstice | LOW |
| `/santoral` | Saints calendar | LOW |
| `/preguntas-frecuentes` | FAQ page | LOW |
| `/app-android` | Android app (pending URL) | LOW |

---

## Quick Reference — Key Files

| Purpose | File |
|---------|------|
| ISO week functions | `src/lib/weeks.ts` |
| Week calendar with holidays | `src/lib/week-calendar.ts` |
| Spanish holidays | `src/lib/holidays.ts` |
| Navigation & FAQs | `src/lib/content.ts` |
| Structured data | `src/lib/structured-data.ts` |
| Homepage | `src/app/page.tsx` |
| Sitemap | `src/app/sitemap.ts` |
| URL redirects | `src/middleware.ts` |

---

## Next Action Items

### Immediate (High Priority)
1. [ ] Build `<DaysCalculator>` component for `/calculadora-dias`
2. [ ] Build `<WeeksCalculator>` component for `/calculadora-semanas`
3. [ ] Build `<AgeCalculator>` component for `/calculadora-edad`
4. [ ] Create `/festivos-por-comunidad` regional holiday selector

### Short-Term (Medium Priority)
5. [ ] Implement puentes detection algorithm
6. [ ] Build `/puentes-2026` and `/puentes-2027` pages
7. [ ] Add `/vacaciones-escolares` by autonomous community
8. [ ] Create `/dias-laborables-2027` with monthly breakdown

### Later (Low Priority)
9. [ ] Add solstice/equinox calculations
10. [ ] Build santoral database
11. [ ] Add day-length charts to sunrise pages
12. [ ] SEO internal linking pass

---

## Technical Notes

### Calculator Component Pattern
```
src/components/calculators/
├── DaysCalculator.tsx      # Days between dates
├── WeeksCalculator.tsx     # ISO weeks between dates
├── AgeCalculator.tsx       # Age from birthdate
└── VacationCalculator.tsx  # Holiday-aware planner
```

### Key Lib Functions Available
- `isoWeek(date)` → { week, year }
- `weeksInYear(year)` → 52 | 53
- `calendarDayDifference(a, b)` → days
- `nationalHolidaysForYear(year)` → holidays[]
- `isoWeeksForYear(year)` → Date[]
