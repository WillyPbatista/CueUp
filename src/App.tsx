import { Badge } from './components/badge';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { Input } from './components/input';

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] p-6">
      <Card
        eyebrow="Componentes"
        title="CueUp UI"
        description="Base visual para lobby, partidas y pantallas de juego."
        variant="highlight"
        className="w-full max-w-md"
        footer={
          <div className="flex flex-wrap gap-2">
            <Badge variant="success" dot>
              Victoria
            </Badge>
            <Badge variant="danger" dot>
              Derrota
            </Badge>
            <Badge variant="warning">En Juego</Badge>
            <Badge>Empate</Badge>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Button fullWidth>Create Room</Button>
          <Button variant="accent" fullWidth>
            Join Room
          </Button>
          <Button variant="outline" fullWidth>
            View Details
          </Button>

          <div className="flex flex-col gap-3 pt-2">
            <Input
              label="Email"
              placeholder="tu@email.com"
              type="email"
              fullWidth
            />
            <Input
              label="Contrasena"
              placeholder="********"
              type="password"
              fullWidth
            />
          </div>
        </div>
      </Card>
    </main>
  );
}

export default App;
