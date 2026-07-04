import { NavLink, Outlet } from 'react-router-dom';

const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'Lobby', to: '/lobby' },
  { label: 'Game', to: '/game/demo-match' },
  { label: 'Settings', to: '/settings' },
  { label: 'Playground', to: '/playground' },
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--border)] bg-[rgba(15,15,15,0.82)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <NavLink
            to="/"
            className="text-2xl font-bold text-[var(--color-gold-soft)]"
          >
            CueUp
          </NavLink>

          <nav className="flex flex-wrap gap-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  [
                    'rounded-md border px-3 py-2 text-sm font-semibold transition',
                    isActive
                      ? 'border-[var(--color-gold)] bg-[rgba(212,175,55,0.14)] text-[var(--color-gold-soft)]'
                      : 'border-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:text-[var(--text-primary)]',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
