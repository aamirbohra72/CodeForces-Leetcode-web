export type Flashcard = {
  id: string;
  front: string;
  back: string;
};

export type RevisionNotes = {
  title: string;
  introduction: string;
  keyConcepts: { heading: string; body: string }[];
};

export type TutorialLearningContent = {
  tutorialId: string;
  coinsPerCorrect: number;
  completionBonusCoins: number;
  watchSessionCoins: number;
  flashcards: Flashcard[];
  notes: RevisionNotes;
};

/**
 * Learning content keyed by tutorial id (sd-t1 / sd-t2 / sd-t3).
 * Flashcards + revision notes are System Design concepts aligned to each tutorial's question bank.
 */
export const tutorialLearningById: Record<string, TutorialLearningContent> = {
  'sd-t1': {
    tutorialId: 'sd-t1',
    coinsPerCorrect: 2,
    completionBonusCoins: 8,
    watchSessionCoins: 3,
    flashcards: [
      {
        id: 't1-f1',
        front: 'Functional vs Non-functional requirement?',
        back: 'Functional = what the system does (quiz attempt, feedback). Non-functional = how well (latency, uptime, scale).',
      },
      {
        id: 't1-f2',
        front: 'How do you estimate daily video egress?',
        back: 'DAU × videos/user/day × size/video. Example: 200k DAU × 3 × 200MB ≈ 120 TB/day → needs CDN.',
      },
      {
        id: 't1-f3',
        front: 'Primary concern in contest write spikes?',
        back: 'Write throughput. Absorb bursts with a queue (Kafka) so DB/workers are not overwhelmed.',
      },
      {
        id: 't1-f4',
        front: 'Multi-resolution storage estimation tip',
        back: 'Sum all variants per video (360p+720p+1080p), then × courses × videos/course.',
      },
      {
        id: 't1-f5',
        front: 'Why BFF for mobile/web/TV?',
        back: 'Each client needs different payloads. BFF gives client-specific backends and avoids over/under-fetching.',
      },
      {
        id: 't1-f6',
        front: 'What does a video transcoder do?',
        back: 'Converts raw uploads into multiple bitrates/resolutions for adaptive streaming (HLS/DASH).',
      },
      {
        id: 't1-f7',
        front: 'CDN primary role?',
        back: 'Serve cached content from edge PoPs close to users to cut latency and origin load.',
      },
      {
        id: 't1-f8',
        front: 'Best protocol for live class chat + signals?',
        back: 'WebSockets — persistent bidirectional low-latency channel.',
      },
      {
        id: 't1-f9',
        front: 'DAU quick formula',
        back: 'Registered users × daily active %. Always state assumptions in estimations.',
      },
      {
        id: 't1-f10',
        front: 'Why object storage for lecture videos?',
        back: 'Cheap durable bulk blobs (S3). App servers should not stream raw files directly.',
      },
    ],
    notes: {
      title: 'Revision Notes: Requirements & Capacity Estimation',
      introduction:
        'Day 1 grounds EdTech HLD in clear requirements and back-of-the-envelope math. Separate functional features from SLOs, then size storage and traffic so CDN, queues, and object storage decisions are justified—not guessed.',
      keyConcepts: [
        {
          heading: 'Requirements framing',
          body: 'List user journeys (enroll, watch, quiz, live class). Mark each need as functional or non-functional before drawing boxes.',
        },
        {
          heading: 'Capacity math',
          body: 'Convert users → DAU → actions/day → bytes/day. Round up and add growth/headroom for peak contests.',
        },
        {
          heading: 'Burst writes',
          body: 'Contests create write storms. Prefer async ingestion (queue) over synchronous DB writes under peak QPS.',
        },
        {
          heading: 'Client diversity',
          body: 'Mobile/web/TV differ; BFF keeps APIs intentional per surface while shared domain services stay stable.',
        },
      ],
    },
  },
  'sd-t2': {
    tutorialId: 'sd-t2',
    coinsPerCorrect: 2,
    completionBonusCoins: 8,
    watchSessionCoins: 3,
    flashcards: [
      {
        id: 't2-f1',
        front: 'Play lecture flow (high level)?',
        back: 'Client → API/Auth → Video service issues CDN/signed URL → CDN edge serves (miss → S3).',
      },
      {
        id: 't2-f2',
        front: 'Best store for watch progress (every 10s)?',
        back: 'Redis for hot updates + periodic flush to PostgreSQL for durability.',
      },
      {
        id: 't2-f3',
        front: 'Course search engine choice?',
        back: 'Elasticsearch — inverted index, multi-field ranking, facets, fuzzy match.',
      },
      {
        id: 't2-f4',
        front: 'Quiz results write-heavy store?',
        back: 'Cassandra (or similar wide-column) for append-heavy, time-ordered analytics reads.',
      },
      {
        id: 't2-f5',
        front: 'Daily recommendations caching?',
        back: 'Precompute batch, cache with ~24h TTL. Staleness is acceptable.',
      },
      {
        id: 't2-f6',
        front: 'Enrollments DB choice?',
        back: 'PostgreSQL — relational, ACID, low write rate vs progress telemetry.',
      },
      {
        id: 't2-f7',
        front: 'Catalog: 10k RPS reads, rare writes?',
        back: 'Cache-aside + long TTL + invalidate on publish.',
      },
      {
        id: 't2-f8',
        front: 'Realtime top-100 leaderboard in Redis?',
        back: 'Sorted Set (ZSET): ZADD score updates, ZREVRANGE for top-N.',
      },
      {
        id: 't2-f9',
        front: 'Adaptive bitrate idea',
        back: 'Client picks segment quality by bandwidth; CDN serves variants produced by transcoder.',
      },
      {
        id: 't2-f10',
        front: 'Polyglot persistence meaning',
        back: 'Pick store per access pattern: SQL for enrollments, Redis for hot keys, search index for discovery.',
      },
    ],
    notes: {
      title: 'Revision Notes: Architecture, Storage & Caching',
      introduction:
        'Day 2 maps components to access patterns: auth at the edge of your API, bytes via CDN, hot telemetry in Redis, durable relational facts in Postgres, and discovery in a search index.',
      keyConcepts: [
        {
          heading: 'Separation of control vs data plane',
          body: 'Authorize and mint URLs in services; do not proxy gigabytes of video through app servers.',
        },
        {
          heading: 'Hot vs cold data',
          body: 'Watch progress is hot and chatty—buffer in memory. Enrollments are sparse and transactional—SQL fits.',
        },
        {
          heading: 'Search is not OLTP',
          body: 'Elasticsearch is optimized for text retrieval and ranking, not as your source of truth for payments/enrollment.',
        },
        {
          heading: 'Cache invalidation',
          body: 'For rarely changing catalogs, long TTL + explicit bust on publish beats guessing short TTLs.',
        },
      ],
    },
  },
  'sd-t3': {
    tutorialId: 'sd-t3',
    coinsPerCorrect: 2,
    completionBonusCoins: 8,
    watchSessionCoins: 3,
    flashcards: [
      {
        id: 't3-f1',
        front: 'Protect execution workers under 50k submissions/min?',
        back: 'Kafka (or queue) between ingest and workers—decouple rates.',
      },
      {
        id: 't3-f2',
        front: 'Hot instructor profiles on consistent hashing?',
        back: 'Add virtual nodes so popular keys spread across physical cache nodes.',
      },
      {
        id: 't3-f3',
        front: 'Circuit Breaker three states?',
        back: 'Closed (normal) → Open (fail fast) → Half-open (probe). Fallback: buffer & retry.',
      },
      {
        id: 't3-f4',
        front: 'Payment then enrollment fails—pattern?',
        back: 'SAGA with compensating transactions (e.g., refund), not 2PC across microservices.',
      },
      {
        id: 't3-f5',
        front: 'Like on userId-sharded data problem?',
        back: 'Dual write: update user shard and video shard consistently (or async eventual).',
      },
      {
        id: 't3-f6',
        front: 'Kafka redelivery after crash—safe approach?',
        back: 'At-least-once delivery + idempotent consumers/operations.',
      },
      {
        id: 't3-f7',
        front: 'Fast “already attempted quiz?” for 50M users?',
        back: 'Bloom filter for cheap negative checks; confirm positives in DB.',
      },
      {
        id: 't3-f8',
        front: 'Live class to 10k students—video path?',
        back: 'SFU (mediasoup-style) fan-out; WebRTC media, not HTTP polling.',
      },
      {
        id: 't3-f9',
        front: 'Chat fan-out across WS servers?',
        back: 'Redis Pub/Sub (or similar) so any node can broadcast to connected sockets.',
      },
      {
        id: 't3-f10',
        front: 'Sandbox for live instructor code?',
        back: 'Isolated containers with limits; push stdout to students over WebSocket.',
      },
    ],
    notes: {
      title: 'Revision Notes: Scale, Queues & Reliability',
      introduction:
        'Day 3 focuses on staying correct under failure and load: queues absorb spikes, SAGA handles multi-step business flows, circuit breakers protect dependencies, and live media needs SFU + WebSockets—not REST loops.',
      keyConcepts: [
        {
          heading: 'Backpressure via queues',
          body: 'Ingest fast, process at worker capacity. Students get quick ACK; sandboxes catch up asynchronously.',
        },
        {
          heading: 'Distributed transactions without 2PC',
          body: 'Prefer SAGA: local commits + compensations. Keep each service’s data ownership clear.',
        },
        {
          heading: 'Idempotency',
          body: 'Retries will happen. Design consumers so reprocessing the same event is safe.',
        },
        {
          heading: 'Live classroom stack',
          body: 'WebRTC/SFU for A/V, WebSocket for chat/control, object storage + transcoder for recordings.',
        },
      ],
    },
  },
};

export function getTutorialLearning(tutorialId: string): TutorialLearningContent | undefined {
  return tutorialLearningById[tutorialId];
}

export function coinsKey(courseId: string, tutorialId: string) {
  return `coins:${courseId}:${tutorialId}`;
}

export type CoinState = {
  /** Coins from correct answers */
  fromProblems: number;
  /** One-time completion bonus claimed */
  completionBonusClaimed: boolean;
  /** Optional: watched session reward claimed */
  watchClaimed: boolean;
};

export function loadCoinState(courseId: string, tutorialId: string): CoinState {
  if (typeof window === 'undefined') {
    return { fromProblems: 0, completionBonusClaimed: false, watchClaimed: false };
  }
  try {
    const raw = localStorage.getItem(coinsKey(courseId, tutorialId));
    if (!raw) return { fromProblems: 0, completionBonusClaimed: false, watchClaimed: false };
    return JSON.parse(raw) as CoinState;
  } catch {
    return { fromProblems: 0, completionBonusClaimed: false, watchClaimed: false };
  }
}

export function saveCoinState(courseId: string, tutorialId: string, state: CoinState) {
  localStorage.setItem(coinsKey(courseId, tutorialId), JSON.stringify(state));
}

/** Recompute problem coins + claim completion bonus when all questions practiced correctly. */
export function syncCoinsFromProgress(
  courseId: string,
  tutorialId: string,
  correctCount: number,
  totalQuestions: number,
  learning: TutorialLearningContent,
): CoinState {
  const prev = loadCoinState(courseId, tutorialId);
  const fromProblems = correctCount * learning.coinsPerCorrect;
  const allCorrect = totalQuestions > 0 && correctCount >= totalQuestions;
  const next: CoinState = {
    ...prev,
    fromProblems,
    completionBonusClaimed: prev.completionBonusClaimed || allCorrect,
  };
  saveCoinState(courseId, tutorialId, next);
  return next;
}

export function totalCoins(state: CoinState, learning: TutorialLearningContent): number {
  return (
    state.fromProblems +
    (state.completionBonusClaimed ? learning.completionBonusCoins : 0) +
    (state.watchClaimed ? learning.watchSessionCoins : 0)
  );
}
