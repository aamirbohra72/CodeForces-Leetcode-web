'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  { label: 'Courses', href: '/learn', icon: '📚' },
  { label: 'Blog', href: '/blog', icon: '✍️' },
  { label: 'Gift a course', href: '/gift', icon: '🎁' },
  { label: 'Certificates', href: '/certificates', icon: '🏆' },
  { label: 'Billing', href: '/billing', icon: '💳' },
  { label: 'Playground', href: '/practice', icon: '💻' },
  { label: 'Write a Blog', href: '/blog/write', icon: '✏️' },
  { label: 'DSA Sheet', href: '/dsa-sheet', icon: '📋' },
  { label: 'Roadmaps', href: '/roadmaps', icon: '🗺️' },
  { label: 'Project Ideas', href: '/projects', icon: '💡' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: '240px',
        background: '#2a2a2a',
        color: 'white',
        height: 'calc(100vh - 60px)',
        position: 'fixed',
        left: 0,
        top: '60px',
        overflowY: 'auto',
        padding: '1.5rem 0',
        borderRight: '1px solid #3a3a3a',
      }}
    >
      <nav>
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                color: isActive ? '#fff' : '#b0b0b0',
                background: isActive ? '#3a3a3a' : 'transparent',
                textDecoration: 'none',
                borderLeft: isActive ? '3px solid #22c55e' : '3px solid transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = '#333';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#b0b0b0';
                }
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <span style={{ fontSize: '0.95rem', fontWeight: isActive ? '600' : '400' }}>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    marginLeft: 'auto',
                    background: '#22c55e',
                    color: 'white',
                    fontSize: '0.7rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '10px',
                    fontWeight: '600',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}


