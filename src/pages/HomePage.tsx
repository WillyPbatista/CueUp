import { Badge } from '../components/badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-9rem)] flex-col items-center justify-center gap-8 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="relative flex flex-col items-center text-center">
        <span className="mb-2 text-xs font-semibold uppercase tracking-[0.42em] text-[var(--color-gold)]">
          Score compete win
        </span>
        <h1 className="relative text-6xl font-black uppercase leading-none text-[var(--color-gold-soft)] [font-family:Georgia,serif] [text-shadow:0_0_8px_rgba(212,175,55,0.95),0_0_22px_rgba(212,175,55,0.55),0_0_42px_rgba(22,163,74,0.45)] sm:text-7xl">
          CUE UP
        </h1>
        <div className="mt-3 h-px w-56 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent shadow-[var(--shadow-glow-gold)]" />
        <div className="pointer-events-none absolute -inset-x-8 top-1/2 -z-10 h-20 rounded-full bg-[radial-gradient(circle,rgba(22,163,74,0.24),transparent_68%)] blur-xl" />
      </header>

      <Card
        eyebrow="CueUp"
        title="Online multiplayer pool"
        description="Punto de entrada para crear salas, unirse al lobby y preparar una partida 1 vs 1."
        variant="highlight"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="success" dot>
              Multiplayer
            </Badge>
            <Badge variant="warning">Realtime</Badge>
            <Badge variant="gold">2 jugadores</Badge>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button fullWidth>Create Room</Button>
            <Button variant="accent" fullWidth>
              Join Room
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
