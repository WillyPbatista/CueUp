import { useCallback, useEffect, useState } from 'react';
import {
  createRoom,
  enterRoom,
  getRoomPlayerReadyStatus,
  getRoomPlayers,
  leaveRoom,
  listWaitingRooms,
  setRoomPlayerConnected,
  setRoomPlayerReady,
  subscribeToRoomPresence,
  subscribeToRoomPlayers,
  subscribeToRooms,
  type LobbyRoom,
  type RealtimeConnectionStatus,
  type RoomPresencePlayer,
  type RoomPlayer,
  type RoomReadyStatus,
} from '../services/lobbyServices';

export function useLobby() {
  const [rooms, setRooms] = useState<LobbyRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [enteringRoomId, setEnteringRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [roomPlayers, setRoomPlayers] = useState<RoomPlayer[]>([]);
  const [roomPlayersLoading, setRoomPlayersLoading] = useState(false);
  const [roomPlayersError, setRoomPlayersError] = useState<string | null>(null);
  const [roomReadyStatus, setRoomReadyStatus] =
    useState<RoomReadyStatus | null>(null);
  const [roomPlayersRealtimeStatus, setRoomPlayersRealtimeStatus] =
    useState<RealtimeConnectionStatus>('connecting');
  const [roomPresencePlayers, setRoomPresencePlayers] = useState<
    RoomPresencePlayer[]
  >([]);
  const [roomPresenceStatus, setRoomPresenceStatus] =
    useState<RealtimeConnectionStatus>('connecting');
  const [leavingRoom, setLeavingRoom] = useState(false);
  const [updatingReady, setUpdatingReady] = useState(false);

  const refreshRooms = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const waitingRooms = await listWaitingRooms();
      setRooms(waitingRooms);
    } catch (error) {
      setErrorMessage(getLobbyErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const createLobbyRoom = useCallback(
    async (hostId: string, requestedCode?: string) => {
      setCreating(true);
      setErrorMessage(null);

      try {
        const room = await createRoom(hostId, requestedCode);
        setRooms((currentRooms) => [room, ...currentRooms]);
        return room;
      } catch (error) {
        const message = getLobbyErrorMessage(error);
        setErrorMessage(message);
        throw new Error(message, { cause: error });
      } finally {
        setCreating(false);
      }
    },
    []
  );

  const enterLobbyRoom = useCallback(
    async (roomId: string, userId: string) => {
      setEnteringRoomId(roomId);
      setErrorMessage(null);

      try {
        const result = await enterRoom(roomId, userId);
        await refreshRooms();
        return result;
      } catch (error) {
        const message = getLobbyErrorMessage(error);
        setErrorMessage(message);
        throw new Error(message, { cause: error });
      } finally {
        setEnteringRoomId(null);
      }
    },
    [refreshRooms]
  );

  useEffect(() => {
    let ignore = false;

    async function loadInitialRooms() {
      try {
        const waitingRooms = await listWaitingRooms();

        if (!ignore) {
          setRooms(waitingRooms);
          setErrorMessage(null);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(getLobbyErrorMessage(error));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInitialRooms();

    const channel = subscribeToRooms(refreshRooms);

    return () => {
      ignore = true;
      channel.unsubscribe();
    };
  }, [refreshRooms]);

  const loadRoomPlayers = useCallback(async (roomId: string) => {
    setRoomPlayersLoading(true);
    setRoomPlayersError(null);

    try {
      const [players, readyStatus] = await Promise.all([
        getRoomPlayers(roomId),
        getRoomPlayerReadyStatus(roomId),
      ]);

      setRoomPlayers(players);
      setRoomReadyStatus(readyStatus);
    } catch (error) {
      setRoomPlayersError(getLobbyErrorMessage(error));
    } finally {
      setRoomPlayersLoading(false);
    }
  }, []);

  const loadRoomReadyStatus = useCallback(async (roomId: string) => {
    try {
      const readyStatus = await getRoomPlayerReadyStatus(roomId);
      setRoomReadyStatus(readyStatus);
    } catch (error) {
      setRoomPlayersError(getLobbyErrorMessage(error));
    }
  }, []);

  const subscribeToLobbyRoomPlayers = useCallback(
    (roomId: string) => {
      setRoomPlayersRealtimeStatus('connecting');

      return subscribeToRoomPlayers(
        roomId,
        () => {
          loadRoomPlayers(roomId);
        },
        setRoomPlayersRealtimeStatus
      );
    },
    [loadRoomPlayers]
  );

  const subscribeToLobbyRoomPresence = useCallback(
    (roomId: string, userId: string) => {
      setRoomPresencePlayers([]);
      setRoomPresenceStatus('connecting');

      return subscribeToRoomPresence(
        roomId,
        userId,
        setRoomPresencePlayers,
        setRoomPresenceStatus
      );
    },
    []
  );

  const backToLobby = useCallback(
    async (roomId: string, userId: string) => {
      setLeavingRoom(true);
      setRoomPlayersError(null);

      try {
        await leaveRoom(roomId, userId);
        await refreshRooms();
      } catch (error) {
        const message = getLobbyErrorMessage(error);
        setRoomPlayersError(message);
        throw new Error(message, { cause: error });
      } finally {
        setLeavingRoom(false);
      }
    },
    [refreshRooms]
  );

  const setCurrentPlayerReady = useCallback(
    async (roomId: string, userId: string, ready: boolean) => {
      setUpdatingReady(true);
      setRoomPlayersError(null);

      try {
        await setRoomPlayerReady(roomId, userId, ready);
        await loadRoomPlayers(roomId);
      } catch (error) {
        const message = getLobbyErrorMessage(error);
        setRoomPlayersError(message);
        throw new Error(message, { cause: error });
      } finally {
        setUpdatingReady(false);
      }
    },
    [loadRoomPlayers]
  );

  const setCurrentPlayerConnected = useCallback(
    async (roomId: string, userId: string, connected: boolean) => {
      try {
        await setRoomPlayerConnected(roomId, userId, connected);
      } catch (error) {
        setRoomPlayersError(getLobbyErrorMessage(error));
      }
    },
    []
  );

  return {
    backToLobby,
    createLobbyRoom,
    creating,
    enterLobbyRoom,
    enteringRoomId,
    errorMessage,
    leavingRoom,
    loading,
    loadRoomPlayers,
    loadRoomReadyStatus,
    refreshRooms,
    roomPlayers,
    roomPlayersError,
    roomPlayersLoading,
    roomPlayersRealtimeStatus,
    roomPresencePlayers,
    roomPresenceStatus,
    roomReadyStatus,
    rooms,
    setCurrentPlayerConnected,
    setCurrentPlayerReady,
    subscribeToLobbyRoomPresence,
    subscribeToLobbyRoomPlayers,
    updatingReady,
  };
}

function getLobbyErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes('rooms_code_format')) {
      return 'Room code must be 4 to 16 characters using letters, numbers or hyphen.';
    }

    if (error.message.includes('duplicate')) {
      return 'That room code already exists. Try another one.';
    }

    if (error.message.includes('room_players_room_id_seat_key')) {
      return 'That player seat was just taken. Refresh and try another room.';
    }

    if (error.message.includes('room_players_room_id_user_id_key')) {
      return 'You are already in this room.';
    }

    if (error.message.toLowerCase().includes('room is full')) {
      return 'This room already has 2 players.';
    }

    return error.message;
  }

  return 'Unexpected lobby error.';
}
