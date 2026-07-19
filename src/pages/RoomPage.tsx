import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '../components/badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { usePlayerProfile } from '../features/auth/usePlayerProfile';
import { useLobby } from '../features/Lobby/hooks/useLobby';
import type { RoomPlayer } from '../features/Lobby/services/lobbyServices';

export function RoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { profile } = usePlayerProfile();
  const {
    backToLobby,
    leavingRoom,
    loadRoomPlayers,
    roomPlayers,
    roomPlayersError,
    roomPlayersLoading,
    roomPlayersRealtimeStatus,
    roomPresencePlayers,
    roomPresenceStatus,
    roomReadyStatus,
    setCurrentPlayerConnected,
    setCurrentPlayerReady,
    subscribeToLobbyRoomPresence,
    subscribeToLobbyRoomPlayers,
    updatingReady,
  } = useLobby();

  const profileId = profile?.id;
  const playerOne = roomPlayers.find((player) => player.seat === 'player_1');
  const playerTwo = roomPlayers.find((player) => player.seat === 'player_2');
  const currentPlayer = roomPlayers.find(
    (player) => player.userId === profileId
  );
  const isRoomFull = roomPlayers.length >= 2;
  const readyCount =
    roomReadyStatus?.readyCount ??
    roomPlayers.filter((player) => player.ready).length;
  const playerCount = roomReadyStatus?.playerCount ?? roomPlayers.length;
  const allPlayersReady =
    roomReadyStatus?.allReady ?? (isRoomFull && readyCount === 2);
  const onlineUserIds = new Set(
    roomPresencePlayers.map((player) => player.userId)
  );

  useEffect(() => {
    if (!roomId) {
      return;
    }

    loadRoomPlayers(roomId);

    const channel = subscribeToLobbyRoomPlayers(roomId);

    return () => {
      channel.unsubscribe();
    };
  }, [loadRoomPlayers, roomId, subscribeToLobbyRoomPlayers]);

  useEffect(() => {
    if (!roomId || !profileId) {
      return;
    }

    const channel = subscribeToLobbyRoomPresence(roomId, profileId);

    return () => {
      channel.unsubscribe();
    };
  }, [profileId, roomId, subscribeToLobbyRoomPresence]);

  useEffect(() => {
    if (!roomId || !profileId) {
      return;
    }

    void setCurrentPlayerConnected(roomId, profileId, true);

    return () => {
      void setCurrentPlayerConnected(roomId, profileId, false);
    };
  }, [profileId, roomId, setCurrentPlayerConnected]);

  if (!roomId) {
    return (
      <Card
        eyebrow="Room"
        title="Missing room"
        description="No encontramos el identificador de esta sala."
        variant="danger"
      >
        <Button onClick={() => navigate('/lobby')} variant="outline">
          Back to Lobby
        </Button>
      </Card>
    );
  }

  async function handleBackToLobby() {
    if (!roomId || !profileId) {
      navigate('/lobby');
      return;
    }

    try {
      await backToLobby(roomId, profileId);
      navigate('/lobby');
    } catch {
      // useLobby owns the user-facing error message.
    }
  }

  async function handleReadyToggle() {
    if (!roomId || !profileId || !currentPlayer) {
      return;
    }

    try {
      await setCurrentPlayerReady(roomId, profileId, !currentPlayer.ready);
    } catch {
      // useLobby owns the user-facing error message.
    }
  }

  return (
    <Card
      eyebrow="Room"
      title="Sala de espera"
      description="Jugadores conectados, asiento asignado y preparacion antes de iniciar la partida."
      footer={
        <div className="flex flex-wrap gap-2">
          <Badge variant={isRoomFull ? 'success' : 'warning'} dot>
            {isRoomFull ? 'Ready for match' : 'Waiting'}
          </Badge>
          <Badge variant="gold">{roomPlayers.length}/2 players</Badge>
          <Badge variant={allPlayersReady ? 'success' : 'warning'}>
            Ready {readyCount}/{Math.max(playerCount, 2)}
          </Badge>
          <Badge
            variant={
              roomPlayersRealtimeStatus === 'subscribed' &&
              roomPresenceStatus === 'subscribed'
                ? 'success'
                : 'warning'
            }
            dot
          >
            Realtime{' '}
            {formatRealtimeStatus(
              roomPlayersRealtimeStatus === 'subscribed'
                ? roomPresenceStatus
                : roomPlayersRealtimeStatus
            )}
          </Badge>
          {currentPlayer ? (
            <Badge>Tu asiento: {formatSeat(currentPlayer.seat)}</Badge>
          ) : null}
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {roomPlayersError ? (
          <p className="rounded-md border border-[var(--color-accent-light)] bg-[rgba(185,28,28,0.16)] p-3 text-sm text-[var(--color-accent-light)]">
            {roomPlayersError}
          </p>
        ) : null}

        {roomPlayersLoading ? (
          <div className="rounded-md border border-[var(--border)] p-4 text-sm text-[var(--text-muted)]">
            Cargando jugadores...
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <PlayerSeatCard
              player={playerOne}
              seat="player_1"
              online={playerOne ? onlineUserIds.has(playerOne.userId) : false}
            />
            <PlayerSeatCard
              player={playerTwo}
              seat="player_2"
              online={playerTwo ? onlineUserIds.has(playerTwo.userId) : false}
            />
          </div>
        )}

        <div className="rounded-md border border-[var(--border)] bg-[rgba(255,255,255,0.04)] p-4">
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Estado ready
          </p>
          <p className="text-sm text-[var(--color-gold-soft)]">
            {allPlayersReady
              ? 'Los dos jugadores estan listos para iniciar.'
              : 'Cuando ambos jugadores marquen ready, podremos crear la partida.'}
          </p>
          <p className="mt-2 break-all text-xs text-[var(--text-muted)]">
            Room id: {roomId}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            disabled={!currentPlayer || updatingReady}
            loading={updatingReady}
            onClick={handleReadyToggle}
            fullWidth
          >
            {currentPlayer?.ready ? 'Cancel Ready' : 'Ready'}
          </Button>
          <Button
            disabled={leavingRoom}
            loading={leavingRoom}
            onClick={handleBackToLobby}
            variant="outline"
            fullWidth
          >
            Back to Lobby
          </Button>
        </div>
      </div>
    </Card>
  );
}

function PlayerSeatCard({
  online,
  player,
  seat,
}: {
  online: boolean;
  player?: RoomPlayer;
  seat: RoomPlayer['seat'];
}) {
  return (
    <article className="rounded-md border border-[var(--border)] bg-[rgba(255,255,255,0.04)] p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            {formatSeat(seat)}
          </p>
          <h3 className="text-xl font-bold text-[var(--color-gold-soft)]">
            {player?.username ?? 'Waiting for player'}
          </h3>
        </div>

        <Badge variant={player ? 'success' : 'warning'} dot>
          {player ? 'Connected' : 'Open'}
        </Badge>
      </div>

      {player ? (
        <div className="flex flex-wrap gap-2">
          <Badge variant={player.ready ? 'success' : 'warning'}>
            {player.ready ? 'Ready' : 'Not ready'}
          </Badge>
          <Badge variant={online ? 'success' : 'warning'} dot>
            {online ? 'Online' : 'Offline'}
          </Badge>
        </div>
      ) : (
        <p className="text-sm text-[var(--text-muted)]">
          Comparte la sala para que otro jugador pueda entrar.
        </p>
      )}
    </article>
  );
}

function formatSeat(seat: RoomPlayer['seat']) {
  return seat === 'player_1' ? 'Player 1' : 'Player 2';
}

function formatRealtimeStatus(status: string) {
  if (status === 'subscribed') {
    return 'online';
  }

  if (status === 'channel_error') {
    return 'error';
  }

  if (status === 'timed_out') {
    return 'timeout';
  }

  if (status === 'closed') {
    return 'closed';
  }

  return 'connecting';
}
