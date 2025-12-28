import Link from 'next/link';

export default function Home() {
  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <h1>Welcome to Codeforces Platform</h1>
      <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        A competitive programming platform for contests and challenges
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href="/learn" className="btn btn-primary">
          Browse Courses
        </Link>
        <Link href="/practice" className="btn btn-primary">
          Start Practicing
        </Link>
        <Link href="/contests" className="btn btn-primary">
          View Contests
        </Link>
        <Link href="/login" className="btn btn-secondary">
          Login
        </Link>
      </div>
    </div>
  );
}

