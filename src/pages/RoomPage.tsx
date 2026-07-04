import { useParams } from 'react-router-dom';
import { Badge } from '../components/badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export function RoomPage() {
  const { roomId } = useParams();

  return (
    <Card
      eyebrow="Room"
      title={roomId ?? 'Room'}
      description="Pantalla previa a la partida: jugadores conectados, ready state e invitacion."
      footer={
        <div className="flex flex-wrap gap-2">
          <Badge variant="warning" dot>
            Waiting
          </Badge>
          <Badge variant="gold">Room code</Badge>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-[var(--border)] p-4">
          Player 1
        </div>
        <div className="rounded-md border border-[var(--border)] p-4 text-[var(--text-muted)]">
          Waiting for player 2
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button fullWidth>Ready</Button>
        <Button variant="outline" fullWidth>
          Copy Invite
        </Button>
      </div>
    </Card>
  );
}
