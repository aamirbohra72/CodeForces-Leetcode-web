# Codeforces Platform — End-to-End Architecture (Excalidraw AI Prompt)

Copy everything inside the block below into **Excalidraw → AI → Generate**.

---

```text
Create a wide, detailed END-TO-END system architecture diagram titled:

"Codeforces Platform — End-to-End Architecture (All Features)"

Use a clean layered layout (top → bottom). Rounded rectangles. Color-code by layer. Show arrows with short labels. Include ALL features below. Keep text readable.

════════════════════════════════════
LAYER 0 — ACTORS (top)
════════════════════════════════════
Three actor boxes:
1) Learner / Student
2) Teaching Assistant (TA)
3) Admin

════════════════════════════════════
LAYER 1 — CLIENT / FRONTEND (Vercel)
════════════════════════════════════
Big green container: "Vercel · apps/web · Next.js 14 App Router · Clerk UI"

Inside it, group feature boxes in 4 columns:

Column A — Learning
- Home + Continue Learning banner (streaks / %)
- Courses (/learn) + AI Course Generator (/learn/create)
- Notebook units/topics + tutorials + assignments + MCQs
- Learning progress % + certificates (≥80%)
- DSA Sheet · Visualizer · Roadmaps

Column B — Practice & Compete
- Practice / Playground (/practice)
- Contests (rated / unrated / practice catalog)
- Challenges + submissions
- Leaderboard
- Code execution / judge UI

Column C — Career & Content
- Interview (JS) voice/chat grading
- Placement Support
- Project Ideas hub (Colosseum / GenAI / Agentic + featured)
- Blog (editorial + live AI pack) + Write a Blog
- Careers hub (job listings)

Column D — Support & Growth
- Support Companion (Ask Support chat)
- TA Help learner queue (/ta-help)
- TA Desk staff claim/reply (/ta-help/desk)
- Billing + Razorpay checkout
- Gift a course · Referral · Affiliate
- Certificates page
- Admin dashboard / contest create

Also show: Clerk Sign-in / Sign-up pages

════════════════════════════════════
LAYER 2 — API GATEWAY / BACKEND (Railway)
════════════════════════════════════
Large blue container: "Railway · apps/api · Express + TypeScript + JWT"

Show shared packages strip:
"@codeforces/db (Prisma) · @codeforces/auth (JWT) · @codeforces/types"

Route/feature modules as labeled boxes inside API:

AUTH
- POST /auth/clerk-exchange (Clerk → platform JWT)
- Roles: USER · TA · ADMIN

LEARNING
- /api/courses (CRUD + AI generate units/topics via Mistral)
- /api/progress (me, course progress, complete item, streaks)
- Certificates eligibility driven by progress

PAYMENTS
- /api/payments (Razorpay order create + verify)
- Enrollment sync → courses access

TA HELP QUEUE
- /api/ta-help (create, mine, queue, claim, reply, status, feedback)
- Statuses: WAITING → CLAIMED → REPLIED → RESOLVED / OPEN_POOL

COMPANION
- /api/companion/chat (Mistral support bot + escalate to TA call)

INTERVIEW
- /api/interview (sessions, turns, Voxtral STT + scoring)

CONTENT
- /api/blog (live Mistral pack + refresh)
- /api/projects (live hub + featured)
- /api/careers/hub (external job feeds + cache)

COMPETE
- /api/contests · /challenges · /submissions · /execute · /leaderboard
- Contest lifecycle job (UPCOMING → LIVE → ENDED)
- Docker judge for code runs (optional host)

EMAIL
- Brevo transactional templates (branded OTP/welcome/notices)

════════════════════════════════════
LAYER 3 — DATA
════════════════════════════════════
Teal box: "Neon PostgreSQL (Prisma)"
Tables / models to list:
User, OTP, Course, Unit, Topic, MCQ, Progress,
CourseLearningProgress, CourseLearningItem, LearningStreak,
PaymentOrder, Enrollment,
Contest, ContestRegistration, Challenge, ChallengeTestCase, Submission, LeaderboardEntry,
InterviewSession, InterviewTurn,
TaHelpRequest, TaHelpReply

Dashed red box: "Redis (optional)"
- Cache (blog/projects)
- Live contest leaderboard ZSET
- API continues without Redis

Dashed orange box: "Docker Judge (optional)"
- Sandboxed code execution for practice/contests
- Prefer VPS when enabled (not Free Railway)

════════════════════════════════════
LAYER 4 — EXTERNAL SaaS
════════════════════════════════════
Right side stacked:
- Clerk — authentication identity
- Razorpay — INR payments
- Brevo — email delivery (API key, IP allowlist)
- Mistral AI — LLM for courses, blog, projects, companion, interview
- Himalayas / Remotive — careers listings (via API)

════════════════════════════════════
KEY USER JOURNEYS (show as numbered colored paths / swim annotations)
════════════════════════════════════
Journey A — Learn & Certify (green path):
Sign in (Clerk) → Browse/Buy course (Razorpay) → Enroll → Study notebook → Complete items → Progress/streak → Certificate

Journey B — Get help (orange path):
Stuck → Companion chat → Request a Call / Text TA → WAITING → TA Desk claim → Reply → Learner feedback → RESOLVED

Journey C — Practice & Contest (blue path):
Practice/Contest → Submit code → Judge/execute → Submission stored → Leaderboard update

Journey D — Interview & Placement (purple path):
Interview session → STT + scored turns → Placement checklist / careers browse

════════════════════════════════════
DEPLOYMENT FOOTER
════════════════════════════════════
Footer bar:
"Deploy map: Frontend → Vercel | Backend → Railway Hobby (~$5) | DB → Neon | Redis/Judge optional later on VPS
SaaS: Clerk · Razorpay · Brevo · Mistral | Solid = required · Dashed = optional for first 50 users"

Style rules:
- Modern, minimal, lots of whitespace but COMPLETE
- Group related features in labeled swimlanes/containers
- Use solid arrows for required flows, dashed for optional
- Title at top, legend at bottom
- No purple-on-white AI cliché; use teal/green/blue/amber accents
```

---

## Quick feature checklist (what the diagram must include)

| Area | Features |
|------|----------|
| Auth | Clerk sign-in/up, JWT exchange, roles USER/TA/ADMIN |
| Learn | Courses, AI generate, notebook, progress, streaks, certificates |
| Pay | Billing, Razorpay, enrollments, gift/referral/affiliate |
| Practice | Playground, DSA sheet, visualizer, roadmaps |
| Compete | Contests, challenges, submissions, judge, leaderboard |
| Support | Companion, TA Help, TA Desk queue |
| Career | Interview bot, placement, careers hub, projects |
| Content | Blog + write, AI packs |
| Infra | Vercel, Railway, Neon, Redis optional, Docker judge optional |
| SaaS | Clerk, Razorpay, Brevo, Mistral |

## Optional Mermaid overview

```mermaid
flowchart TB
  subgraph Actors
    L[Learner]
    T[TA]
    A[Admin]
  end

  subgraph Vercel["Vercel · Next.js Frontend"]
    FE[Home · Learn · Practice · Contests · Billing]
    FE2[Companion · TA Help · Interview · Blog · Projects]
    FE3[Certificates · DSA · Visualizer · Roadmaps · Placement · Gift/Referral/Affiliate]
    AD[Admin Dashboard · TA Desk]
  end

  subgraph Railway["Railway · Express API"]
    AUTH[/auth/clerk-exchange]
    LEARN[/courses /progress]
    PAY[/payments]
    TA[/ta-help]
    COMP[/companion]
    INT[/interview]
    CONT[/blog /projects /careers]
    JUDGE[/contests /challenges /submissions /execute /leaderboard]
  end

  subgraph Data
    NEON[(Neon Postgres)]
    REDIS[(Redis optional)]
    DOCKER[Docker Judge optional]
  end

  subgraph SaaS
    CLERK[Clerk]
    RZP[Razorpay]
    BREVO[Brevo]
    MISTRAL[Mistral]
  end

  L --> FE
  T --> AD
  A --> AD
  FE --> AUTH
  FE2 --> COMP
  FE2 --> TA
  FE --> LEARN
  FE --> PAY
  FE --> JUDGE
  FE2 --> INT
  FE2 --> CONT
  AUTH --> CLERK
  AUTH --> NEON
  LEARN --> NEON
  LEARN --> MISTRAL
  PAY --> RZP
  PAY --> NEON
  TA --> NEON
  COMP --> MISTRAL
  COMP --> TA
  INT --> MISTRAL
  INT --> NEON
  CONT --> MISTRAL
  CONT --> NEON
  CONT -.-> REDIS
  JUDGE --> NEON
  JUDGE -.-> REDIS
  JUDGE -.-> DOCKER
  Railway --> BREVO
```
