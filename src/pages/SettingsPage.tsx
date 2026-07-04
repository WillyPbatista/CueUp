import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/input';

export function SettingsPage() {
  return (
    <Card
      eyebrow="Settings"
      title="Player profile"
      description="Preferencias locales y perfil del jugador."
      className="max-w-xl"
    >
      <div className="flex flex-col gap-4">
        <Input label="Display name" placeholder="Carlos" fullWidth />
        <Input label="Table theme" placeholder="Casino green" fullWidth />
        <Button fullWidth>Save Settings</Button>
      </div>
    </Card>
  );
}
