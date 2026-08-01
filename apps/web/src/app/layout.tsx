import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { ClerkApiBridge } from '@/components/ClerkApiBridge';
import './globals.css';

export const metadata: Metadata = {
  title: 'Codeforces Platform',
  description: 'A competitive programming platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ClerkApiBridge />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
