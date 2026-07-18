import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/input';
import { Modal } from '../components/Modal';
import { usePlayerProfile } from '../features/auth/usePlayerProfile';
import { useLobby } from '../features/Lobby/hooks/useLobby';
import { normalizeRoomCode } from '../features/Lobby/services/lobbyServices';

export function LobbyPage() {
  const navigate = useNavigate();
  const { isLoading: profileLoading, profile } = usePlayerProfile();
  const {
    createLobbyRoom,
    creating,
    enterLobbyRoom,
    enteringRoomId,
    errorMessage,
    loading,
    refreshRooms,
    rooms,
  } = useLobby();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  async function handleCreateRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!profile) {
      setFormError('Create a player profile from Home before creating a room.');
      return;
    }

    const normalizedCode = normalizeRoomCode(roomCode);

    if (normalizedCode && !/^[A-Z0-9-]{4,16}$/.test(normalizedCode)) {
      setFormError('Use 4 to 16 characters: letters, numbers or hyphen.');
      return;
    }

    setFormError(null);

    try {
      const room = await createLobbyRoom(
        profile.id,
        normalizedCode || undefined
      );
      setCreateModalOpen(false);
      setRoomCode('');
      navigate(`/rooms/${room.id}`);
    } catch {
      // useLobby owns the user-facing error message.
    }
  }

  async function handleEnterRoom(roomId: string) {
    if (!profile) {
      setFormError('Create a player profile from Home before entering a room.');
      return;
    }

    setFormError(null);

    try {
      await enterLobbyRoom(roomId, profile.id);
      navigate(`/rooms/${roomId}`);
    } catch {
      // useLobby owns the user-facing error message.
    }
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card
          eyebrow="Lobby"
          title="Salas"
          description="Crea una sala o entra a una partida disponible."
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant={profile ? 'success' : 'warning'} dot>
                {profile ? `Player: ${profile.username}` : 'No player profile'}
              </Badge>
              <Badge variant="gold">Realtime rooms</Badge>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                disabled={!profile || profileLoading}
                fullWidth
                onClick={() => setCreateModalOpen(true)}
              >
                Crear Sala
              </Button>
              <Button
                loading={loading}
                onClick={refreshRooms}
                variant="outline"
                fullWidth
              >
                Actualizar
              </Button>
              {!profile ? (
                <Button onClick={() => navigate('/')} variant="ghost" fullWidth>
                  Crear jugador
                </Button>
              ) : null}
            </div>

            {errorMessage ? (
              <p className="text-sm text-[var(--color-accent-light)]">
                {errorMessage}
              </p>
            ) : null}
          </div>
        </Card>

        <Card
          eyebrow="Room list"
          title="Waiting for players"
          footer={
            <div className="flex flex-wrap gap-2">
              <Badge variant="warning" dot>
                Waiting
              </Badge>
              <Badge>{rooms.length} rooms</Badge>
            </div>
          }
        >
          {loading ? (
            <div className="rounded-md border border-[var(--border)] p-4 text-sm text-[var(--text-muted)]">
              Cargando salas...
            </div>
          ) : rooms.length > 0 ? (
            <div className="flex flex-col gap-3">
              {rooms.map((room) => (
                <article
                  className="flex flex-col gap-3 rounded-md border border-[var(--border)] bg-[rgba(255,255,255,0.04)] p-4 sm:flex-row sm:items-center sm:justify-between"
                  key={room.id}
                >
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                      Room code
                    </p>
                    <p className="text-xl font-bold text-[var(--color-gold-soft)]">
                      {room.code}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="warning">{room.status}</Badge>
                    <Badge>{room.playerCount}/2 players</Badge>
                    <Button
                      disabled={
                        !profile ||
                        room.playerCount >= 2 ||
                        enteringRoomId === room.id
                      }
                      loading={enteringRoomId === room.id}
                      onClick={() => handleEnterRoom(room.id)}
                      size="small"
                    >
                      Entrar
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-[var(--border)] p-4 text-sm text-[var(--text-muted)]">
              No hay salas activas todavia.
            </div>
          )}
        </Card>
      </div>

      <Modal
        description="Puedes dejar el codigo vacio y CueUp generara uno automaticamente."
        onClose={() => setCreateModalOpen(false)}
        open={createModalOpen}
        title="Crear sala"
      >
        <form className="flex flex-col gap-4" onSubmit={handleCreateRoom}>
          <Input
            disabled={creating}
            error={formError ?? errorMessage ?? undefined}
            label="Codigo de sala"
            onChange={setRoomCode}
            placeholder="CUE-01"
            value={roomCode}
            fullWidth
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button loading={creating} type="submit" fullWidth>
              Crear
            </Button>
            <Button
              disabled={creating}
              onClick={() => setCreateModalOpen(false)}
              type="button"
              variant="outline"
              fullWidth
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
