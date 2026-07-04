import { Badge } from '../components/badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export function LobbyPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <Card
        eyebrow="Lobby"
        title="Rooms"
        description="Aqui apareceran las salas disponibles cuando conectemos Supabase Realtime."
      >
        <div className="flex flex-col gap-3">
          <Button fullWidth>Create Room</Button>
          <Button variant="outline" fullWidth>
            Refresh
          </Button>
        </div>
      </Card>

      <Card
        eyebrow="Room preview"
        title="Waiting for players"
        footer={
          <div className="flex flex-wrap gap-2">
            <Badge variant="warning" dot>
              Waiting
            </Badge>
            <Badge>0/2 players</Badge>
          </div>
        }
      >
        <div className="rounded-md border border-[var(--border)] p-4 text-sm text-[var(--text-muted)]">
          No hay salas activas todavia.
        </div>
      </Card>
    </div>
  );
}
