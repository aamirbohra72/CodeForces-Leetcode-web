import { Suspense } from 'react';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ maxWidth: '400px', marginTop: '2rem' }}>
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
