import type { Assignment } from '@/types/assignment';

/** High Level Design assignment — attach to System Design course (id: 5) */
export const hldEdtechAssignment: Assignment = {
  id: 'hld-edtech',
  courseId: '5',
  title: 'High Level Design: Scalable EdTech Platform',
  description:
    'Design a scalable, distributed EdTech platform similar to Scaler/Coursera that supports live classes, recorded content, assessments, and real-time collaboration.',
  total_marks: 100,
  estimated_time: '3 hours',
  sections: [
    {
      section_id: 'S1',
      title: 'Requirements & Estimations',
      marks: 15,
      questions: [
        {
          id: 'Q1',
          type: 'multiple_choice',
          marks: 3,
          question:
            'Which of the following best describes a functional requirement for an EdTech platform?',
          options: [
            'The system should handle 1 million concurrent users',
            'Students should be able to attempt quizzes and receive instant feedback',
            'The platform should have 99.99% uptime',
            'Video content should load within 2 seconds',
          ],
          correct_answer:
            'Students should be able to attempt quizzes and receive instant feedback',
          explanation:
            'Functional requirements describe what the system does — features and behaviors. The others describe non-functional requirements (scalability, availability, performance).',
        },
        {
          id: 'Q2',
          type: 'multiple_choice',
          marks: 3,
          question:
            'Your EdTech platform has 2 million registered users. Assuming 10% DAU, each user watches an average of 3 videos/day, and each video is 200MB. What is the approximate daily data served?',
          options: ['60 TB/day', '120 TB/day', '600 GB/day', '6 TB/day'],
          correct_answer: '120 TB/day',
          explanation:
            '2M * 10% = 200,000 DAU. 200,000 * 3 videos * 200MB = 120,000,000 MB = 120 TB/day. This justifies needing a CDN.',
        },
        {
          id: 'Q3',
          type: 'multiple_choice',
          marks: 3,
          question:
            'During a live IPL-style coding contest on your platform, 500,000 users submit code simultaneously. What is the primary concern?',
          options: [
            'Database schema design',
            'Write throughput and queue-based ingestion',
            'CSS rendering performance',
            'DNS resolution time',
          ],
          correct_answer: 'Write throughput and queue-based ingestion',
          explanation:
            'Sudden massive write spikes require a message queue (Kafka) to absorb load and process submissions asynchronously, preventing database overload.',
        },
        {
          id: 'Q4',
          type: 'short_answer',
          marks: 6,
          question:
            'Estimate the storage requirements for your EdTech platform given: 10,000 courses, average 50 videos per course, each video stored in 3 resolutions (360p=100MB, 720p=300MB, 1080p=700MB). Show your calculation.',
          expected_answer:
            '10,000 courses × 50 videos × (100 + 300 + 700)MB = 10,000 × 50 × 1,100MB = 550,000,000 MB = 550 TB',
          explanation:
            'Total = 10k × 50 × 1.1GB = 550TB. This drives the need for object storage like S3 and a CDN layer.',
        },
      ],
    },
    {
      section_id: 'S2',
      title: 'System Architecture & Components',
      marks: 20,
      questions: [
        {
          id: 'Q5',
          type: 'multiple_choice',
          marks: 4,
          question:
            'Your EdTech platform serves a mobile app, web app, and smart TV app. Each has very different data needs — mobile needs lightweight payloads, web needs rich data, TV needs a simplified UI model. Which architecture best addresses this?',
          options: [
            'Single REST API gateway for all clients',
            'GraphQL with client-specified queries',
            'Backend for Frontend (BFF) pattern with separate backends per client',
            'gRPC with protocol buffers',
          ],
          correct_answer: 'Backend for Frontend (BFF) pattern with separate backends per client',
          explanation:
            'BFF creates dedicated backend layers per client type, each returning data optimized for that client\'s specific needs — preventing over-fetching/under-fetching.',
        },
        {
          id: 'Q6',
          type: 'multiple_choice',
          marks: 4,
          question:
            'Which component is responsible for converting uploaded raw video lectures into multiple resolutions (360p, 720p, 1080p) suitable for adaptive bitrate streaming?',
          options: [
            'CDN Edge Server',
            'API Gateway',
            'Video Transcoding Service',
            'Load Balancer',
          ],
          correct_answer: 'Video Transcoding Service',
          explanation:
            'A dedicated transcoding service (e.g., using FFmpeg) processes raw uploads and outputs multiple resolution variants. These are then stored in S3 and served via CDN.',
        },
        {
          id: 'Q7',
          type: 'multiple_choice',
          marks: 4,
          question: 'What is the primary role of a CDN in your EdTech video delivery architecture?',
          options: [
            'To transcode video into multiple formats',
            'To serve video content from geographically distributed edge servers closer to the user',
            'To authenticate users before video playback',
            'To store the original raw video files',
          ],
          correct_answer:
            'To serve video content from geographically distributed edge servers closer to the user',
          explanation:
            'CDNs cache content at edge PoPs globally, reducing latency and origin server load. A user in Mumbai gets content from a Mumbai edge server, not a US origin.',
        },
        {
          id: 'Q8',
          type: 'multiple_choice',
          marks: 4,
          question:
            "Your platform needs to support live coding classes where the instructor's screen is shared and students ask questions in real-time. Which protocol is most appropriate for this bidirectional, low-latency communication?",
          options: [
            'HTTP long polling',
            'REST API with 1-second polling interval',
            'WebSockets',
            'FTP',
          ],
          correct_answer: 'WebSockets',
          explanation:
            'WebSockets maintain a persistent bidirectional connection, enabling real-time features like live Q&A, chat, and instructor screen-share signals with minimal latency.',
        },
        {
          id: 'Q9',
          type: 'short_answer',
          marks: 4,
          question:
            "Draw and describe the high-level architecture flow when a student clicks 'Play' on a recorded lecture. Include: client, CDN, auth service, video service, and object storage.",
          expected_answer:
            'Client → API Gateway → Auth Service (validate token) → Video Service (generate pre-signed URL or CDN token) → Client uses URL → CDN Edge (cache hit: serve directly; cache miss: fetch from S3 → cache → serve). Student gets adaptive bitrate stream (HLS/DASH).',
          explanation:
            'The key insight is auth happens at the API layer, the actual video bytes are served via CDN (not through your backend), and adaptive bitrate adjusts quality based on the student\'s bandwidth.',
        },
      ],
    },
    {
      section_id: 'S3',
      title: 'Database Design & Storage',
      marks: 20,
      questions: [
        {
          id: 'Q10',
          type: 'multiple_choice',
          marks: 4,
          question:
            'Your platform needs to store: user profiles, course metadata, video watch progress (updated every 10 seconds per user per video), and discussion forum posts. Which storage strategy is most appropriate for watch progress?',
          options: [
            'PostgreSQL with ACID transactions',
            'Redis for real-time updates with periodic flush to PostgreSQL',
            'MongoDB document store',
            'Elasticsearch',
          ],
          correct_answer: 'Redis for real-time updates with periodic flush to PostgreSQL',
          explanation:
            'Watch progress updates every 10 seconds per user — extremely high write frequency. Redis handles this in-memory with low latency. Periodic batch flush to PostgreSQL ensures durability without overwhelming the primary DB.',
        },
        {
          id: 'Q11',
          type: 'multiple_choice',
          marks: 4,
          question:
            "You need to implement a 'search courses by topic, instructor, rating, and difficulty' feature. Which database is most suitable?",
          options: [
            'PostgreSQL with B-tree indexes',
            'Redis sorted sets',
            'Elasticsearch with inverted index',
            'Cassandra with wide-column storage',
          ],
          correct_answer: 'Elasticsearch with inverted index',
          explanation:
            "Elasticsearch's inverted index enables full-text search across multiple fields with ranking/scoring. It handles fuzzy matching, multi-field queries, and faceted filtering — ideal for course search.",
        },
        {
          id: 'Q12',
          type: 'multiple_choice',
          marks: 4,
          question:
            'Your platform stores quiz results for millions of students across thousands of courses. The access pattern is: write once (on submission), read by student (infrequently), and aggregate for instructor dashboards. Which database best fits this write-heavy, time-series-like workload?',
          options: [
            'MySQL with normalized schema',
            'Cassandra with wide-column model',
            'Neo4j graph database',
            'Redis in-memory store',
          ],
          correct_answer: 'Cassandra with wide-column model',
          explanation:
            'Cassandra excels at write-heavy workloads with time-series-like data. Partition key = course_id, clustering key = submission_timestamp gives fast writes and efficient range reads for instructor dashboards.',
        },
        {
          id: 'Q13',
          type: 'multiple_choice',
          marks: 4,
          question:
            "To implement a 'courses you might like' recommendation feed that updates daily, which caching strategy is most appropriate?",
          options: [
            'Write-through cache (update cache on every user action)',
            'No cache — compute recommendations on every request',
            'TTL-based cache (pre-compute daily, cache with 24hr TTL)',
            'Write-around cache',
          ],
          correct_answer: 'TTL-based cache (pre-compute daily, cache with 24hr TTL)',
          explanation:
            'Recommendations are batch-computed (e.g., via ML pipeline nightly). TTL of 24hrs means slightly stale data is acceptable — perfectly matching the TTL caching use case.',
        },
        {
          id: 'Q14',
          type: 'short_answer',
          marks: 4,
          question:
            'Design the database schema (table name + key columns) for storing: a) course enrollment and b) video watch progress. Mention which database you\'d use for each and why.',
          expected_answer:
            "Enrollments: PostgreSQL — enrollments(user_id, course_id, enrolled_at, status). Relational, low write frequency, needs ACID. Watch Progress: Redis hash per user — key: progress:{user_id}:{video_id}, fields: watched_seconds, last_updated. Then async flush to PostgreSQL for persistence.",
          explanation:
            'Different data has different access patterns — use polyglot persistence. Enrollments are transactional (PostgreSQL), progress is high-frequency (Redis first, then durable storage).',
        },
      ],
    },
    {
      section_id: 'S4',
      title: 'Scalability & Performance',
      marks: 20,
      questions: [
        {
          id: 'Q15',
          type: 'multiple_choice',
          marks: 4,
          question:
            'Your course catalog service is read 10,000 times/second but updated only when instructors publish new content (a few times/day). What is the ideal caching approach?',
          options: [
            'No caching — always read from database',
            'Write-through cache with immediate consistency',
            'Cache-aside with long TTL and cache invalidation on publish',
            'Write-back cache',
          ],
          correct_answer: 'Cache-aside with long TTL and cache invalidation on publish',
          explanation:
            'Extremely read-heavy, rarely written. Cache-aside loads data on first miss, serves from cache thereafter. On new course publish, explicitly invalidate that cache key. Long TTL since updates are rare.',
        },
        {
          id: 'Q16',
          type: 'multiple_choice',
          marks: 4,
          question:
            'During a major live contest on your platform, the leaderboard needs to display top 100 students ranked by score, updated in real-time. Which data structure in Redis is perfect for this?',
          options: ['Redis Hash', 'Redis List', 'Redis Sorted Set (ZSET)', 'Redis Bitmap'],
          correct_answer: 'Redis Sorted Set (ZSET)',
          explanation:
            'Redis Sorted Sets store members with scores, auto-sorted. ZADD updates a student\'s score in O(log N). ZREVRANGE fetches top-100 in O(log N + 100). Perfect for real-time leaderboards.',
        },
        {
          id: 'Q17',
          type: 'multiple_choice',
          marks: 4,
          question:
            'Your code submission service receives 50,000 submissions/minute during a contest. Each submission needs to be compiled and executed in a sandbox. What pattern prevents your execution workers from being overwhelmed?',
          options: [
            'Synchronous REST API calls directly to execution workers',
            'Message queue (Kafka) between submission service and execution workers',
            'Increasing execution worker CPU by 10x',
            'Storing submissions in PostgreSQL and polling every second',
          ],
          correct_answer: 'Message queue (Kafka) between submission service and execution workers',
          explanation:
            'Kafka absorbs the burst — submissions are enqueued instantly (fast response to student). Workers consume at their own pace. This decouples ingestion rate from processing rate, preventing overload.',
        },
        {
          id: 'Q18',
          type: 'multiple_choice',
          marks: 4,
          question:
            "Your platform's user service is experiencing hot spots — a few celebrity instructor profile pages receive 100x more traffic than others. Consistent hashing assigns all requests for these instructors to the same cache node. What solves this?",
          options: [
            'Switch to modulo-based sharding',
            "Add virtual nodes to distribute the instructor's data across multiple cache nodes",
            'Increase the TTL for hot instructor profiles',
            'Use a SQL database instead of cache',
          ],
          correct_answer:
            "Add virtual nodes to distribute the instructor's data across multiple cache nodes",
          explanation:
            'Virtual nodes place each physical node at multiple positions on the consistent hash ring. Hot keys get distributed across multiple vnodes (and thus multiple physical nodes), spreading the load.',
        },
        {
          id: 'Q19',
          type: 'short_answer',
          marks: 4,
          question:
            "Your platform's notification service (sending email/push notifications for new course launches) depends on an external email provider. That provider goes down. How would you apply the Circuit Breaker pattern here? Describe the three states and fallback behavior.",
          expected_answer:
            'Closed: provider healthy, notifications sent normally. Open: after N failures, stop calling provider, fail fast — queue notifications for retry later (or use backup provider). Half-Open: after cooldown, send 1 test notification. If success → Closed. If fail → reopen. Fallback: buffer notifications in Kafka, retry when circuit closes.',
          explanation:
            'Circuit Breaker prevents cascading failure into the notification service when the email provider is down, while Kafka ensures no notification is permanently lost.',
        },
      ],
    },
    {
      section_id: 'S5',
      title: 'Distributed Systems & Reliability',
      marks: 25,
      questions: [
        {
          id: 'Q20',
          type: 'multiple_choice',
          marks: 5,
          question:
            'A student enrolls in a paid course. This triggers: (1) Payment Service charges the card, (2) Enrollment Service adds the student to the course, (3) Notification Service sends a confirmation email. If step 2 fails after step 1 succeeds, what pattern handles rollback correctly?',
          options: [
            'Two-Phase Commit (2PC) across all three services',
            'SAGA pattern with compensating transactions',
            'Single database transaction spanning all services',
            'Retry step 2 indefinitely until it succeeds',
          ],
          correct_answer: 'SAGA pattern with compensating transactions',
          explanation:
            'SAGA executes local transactions in sequence. If Enrollment fails after Payment succeeds, a compensating transaction (refund) is triggered for Payment. No distributed locks needed.',
        },
        {
          id: 'Q21',
          type: 'multiple_choice',
          marks: 5,
          question:
            "Your platform allows students to 'like' course videos. The like count is displayed publicly and updated in real-time. You're using userId-based sharding. What problem arises when a student likes a video?",
          options: [
            'The like cannot be stored without a graph database',
            "It requires two writes — one to the student's shard and one to the video's shard — which must be consistent",
            "Like counts require a sorted set which sharding doesn't support",
            'It requires accessing all shards simultaneously to count total likes',
          ],
          correct_answer:
            "It requires two writes — one to the student's shard and one to the video's shard — which must be consistent",
          explanation:
            "userId sharding puts student data on one shard and video data on another. A 'like' must update both (student's liked-videos list + video's like count) — creating the dual-write consistency challenge.",
        },
        {
          id: 'Q22',
          type: 'multiple_choice',
          marks: 5,
          question:
            'Your platform uses Kafka for processing video upload events. A transcoding worker crashes mid-processing. When the worker restarts, it re-reads the same Kafka message and starts transcoding again. What property does Kafka need to guarantee for this to work safely?',
          options: [
            'At-most-once delivery',
            'Exactly-once semantics with idempotent consumers',
            'At-least-once delivery with idempotent transcoding operations',
            'FIFO ordering across all partitions',
          ],
          correct_answer: 'At-least-once delivery with idempotent transcoding operations',
          explanation:
            'At-least-once ensures no message is lost. Idempotent transcoding means re-processing the same video is safe (output is identical). Together they guarantee correctness without complex exactly-once overhead.',
        },
        {
          id: 'Q23',
          type: 'multiple_choice',
          marks: 5,
          question:
            'Your platform wants to quickly check if a student has already attempted a quiz (to prevent re-attempts) across 50 million students. You want O(1) lookup with minimal memory. What data structure do you use?',
          options: [
            'HashMap in application memory',
            'PostgreSQL index lookup',
            'Bloom Filter',
            'Redis List',
          ],
          correct_answer: 'Bloom Filter',
          explanation:
            "Bloom filters provide O(1) probabilistic membership testing with minimal memory. 'Definitely not attempted' → allow attempt. 'Possibly attempted' → verify with DB. Perfect for this access pattern.",
        },
        {
          id: 'Q24',
          type: 'long_answer',
          marks: 5,
          question:
            "Design the high-level architecture for a 'Live Coding Class' feature on your EdTech platform. The feature requires: (a) instructor screen sharing to 10,000 concurrent students, (b) student Q&A chat in real-time, (c) instructor can run and share code output live, (d) class recording saved for later. Describe the key components, protocols used, and how you'd handle the scale.",
          expected_answer:
            'Screen share: WebRTC for P2P (small classes) or SFU (Selective Forwarding Unit like mediasoup) for large classes — instructor stream → SFU → fan-out to all students. Chat: WebSocket connections via a Chat Service backed by Redis Pub/Sub for fan-out across multiple WebSocket servers. Code execution: Instructor code → Code Execution Service (sandboxed Docker container) → output pushed via WebSocket to all students. Recording: Media server captures the stream → uploads to S3 → triggers transcoding pipeline for VOD. Scale: Horizontal scaling of WebSocket servers behind a load balancer with sticky sessions or Redis Pub/Sub for cross-node message delivery.',
          explanation:
            'Key decisions: WebRTC/SFU for video (not HTTP), WebSocket for chat (not polling), isolated sandboxes for code execution (security), and async recording pipeline (non-blocking).',
        },
      ],
    },
  ],
  grading_rubric: {
    multiple_choice: 'Full marks for correct answer only',
    short_answer: {
      full_marks: 'Correct approach + calculation/schema + justification',
      partial_marks: 'Correct approach but missing justification or minor errors',
      zero: 'Incorrect approach or blank',
    },
    long_answer: {
      full_marks: 'All components identified, correct protocols, scale considerations addressed',
      partial_marks: 'Most components correct, missing 1-2 key design decisions',
      zero: 'Missing core architecture or fundamentally incorrect approach',
    },
  },
  topics_covered: [
    'Requirements gathering & capacity estimation',
    'Backend for Frontend (BFF) pattern',
    'CDN & adaptive bitrate streaming',
    'Polyglot persistence (PostgreSQL, Redis, Cassandra, Elasticsearch)',
    'Caching strategies (TTL, cache-aside, write-through)',
    'Consistent hashing & virtual nodes',
    'SAGA pattern & distributed transactions',
    'Circuit Breaker pattern',
    'Kafka & message queues',
    'Bloom filters',
    'WebSockets & WebRTC',
    'Sharding strategies',
  ],
};
