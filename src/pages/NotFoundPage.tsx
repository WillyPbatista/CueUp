import { Link } from 'react-router-dom';
import { Card } from '../components/Card';

export function NotFoundPage() {
  return (
    <Card
      eyebrow="404"
      title="Page not found"
      description="La ruta que intentaste abrir no existe en CueUp."
      variant="danger"
      className="max-w-xl"
    >
      <Link
        to="/"
        className="inline-flex w-fit items-center justify-center rounded-md border border-[var(--color-gold)] px-5 py-3 font-semibold text-[var(--color-gold-soft)] transition hover:bg-[rgba(212,175,55,0.08)]"
      >
        Back Home
      </Link>
    </Card>
  );
}
