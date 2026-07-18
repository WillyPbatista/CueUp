import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/input';
import { usePlayerProfile } from '../features/auth/usePlayerProfile';

export function HomePage() {
  const navigate = useNavigate();
  const { errorMessage, isLoading, isReady, profile, registerPlayer, signOut } =
    usePlayerProfile();
  const [username, setUsername] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (username.trim().length < 3) {
      setFormError('El nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (username.trim().length > 24) {
      setFormError('El nombre debe tener 24 caracteres o menos.');
      return;
    }

    setFormError(null);

    try {
      await registerPlayer(username);
      navigate('/lobby');
    } catch {
      // The hook owns the user-facing error message.
    }
  }

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

          {isReady && profile ? (
            <div className="flex flex-col gap-4">
              <div className="rounded-md border border-[var(--border)] bg-[rgba(255,255,255,0.04)] p-4">
                <p className="text-sm text-[var(--text-muted)]">
                  Jugador listo
                </p>
                <p className="text-2xl font-bold text-[var(--color-gold-soft)]">
                  {profile.username}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={() => navigate('/lobby')} fullWidth>
                  Enter Lobby
                </Button>
                <Button variant="outline" onClick={signOut} fullWidth>
                  Change Player
                </Button>
              </div>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Input
                label="Nombre de jugador"
                placeholder="Jugador 1"
                value={username}
                onChange={setUsername}
                error={formError ?? errorMessage ?? undefined}
                disabled={isLoading}
                fullWidth
              />

              <Button type="submit" loading={isLoading} fullWidth>
                Save Player
              </Button>

              <p className="text-sm leading-6 text-[var(--text-muted)]">
                Usaremos una sesion anonima de Supabase para asociar tus salas y
                partidas a este nombre. No necesitas email ni password todavia.
              </p>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}
