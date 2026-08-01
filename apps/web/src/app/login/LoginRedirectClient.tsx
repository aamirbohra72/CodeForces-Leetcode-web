'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginRedirectClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const from = searchParams.get('from');
    const qs = from ? `?redirect_url=${encodeURIComponent(from)}` : '';
    router.replace(`/sign-in${qs}`);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212] text-white/70">
      Redirecting to sign in…
    </div>
  );
}
