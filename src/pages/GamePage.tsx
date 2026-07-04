import { useParams } from 'react-router-dom';
import { Badge } from '../components/badge';
import { Card } from '../components/Card';

export function GamePage() {
  const { matchId } = useParams();

  return (
    <Card
      eyebrow="Game"
      title={matchId ?? 'Match'}
      description="Aqui se montara Phaser cuando empecemos el modulo de gameplay."
      footer={
        <div className="flex flex-wrap gap-2">
          <Badge variant="success" dot>
            Connected
          </Badge>
          <Badge variant="warning">Player turn</Badge>
        </div>
      }
    >
      <div className="flex aspect-video items-center justify-center rounded-lg border border-[var(--color-primary-light)] bg-[radial-gradient(circle_at_center,rgba(22,101,52,0.34),rgba(15,15,15,0.92))] text-sm text-[var(--text-muted)]">
        Phaser canvas placeholder
      </div>
    </Card>
  );
}
