import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabase/client';

export interface LobbyRoom {
  id: string;
  code: string;
  status: 'waiting' | 'ready' | 'playing' | 'finished' | 'cancelled';
  hostId: string;
  createdAt: string;
  updatedAt: string;
  playerCount: number;
}

interface RoomRow {
  id: string;
  code: string;
  status: LobbyRoom['status'];
  host_id: string;
  created_at: string;
  updated_at: string;
  room_players?: Array<{ id: string }>;
}

interface RoomSeatRow {
  user_id: string;
  seat: 'player_1' | 'player_2';
}

interface MatchRow {
  id: string;
  room_id: string;
  player_1_id: string;
  player_2_id: string;
  status: 'playing' | 'finished' | 'abandoned';
  started_at: string;
}

export interface RoomPlayerRow {
  id: string;
  user_id: string;
  seat: 'player_1' | 'player_2';
  ready: boolean;
  connected: boolean;
  joined_at: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
  } | null;
}

export interface RoomPlayer {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  seat: 'player_1' | 'player_2';
  ready: boolean;
  connected: boolean;
  joinedAt: string;
}

export interface RoomReadyStatus {
  playerCount: number;
  readyCount: number;
  allReady: boolean;
  players: Array<{
    userId: string;
    username: string;
    seat: RoomPlayer['seat'];
    ready: boolean;
  }>;
}

export interface RoomPresencePlayer {
  userId: string;
  onlineAt: string;
}

export interface Match {
  id: string;
  roomId: string;
  player1Id: string;
  player2Id: string;
  status: MatchRow['status'];
  startedAt: string;
}

export type RealtimeConnectionStatus =
  'connecting' | 'subscribed' | 'timed_out' | 'closed' | 'channel_error';

export async function listWaitingRooms() {
  const { data, error } = await supabase
    .from('rooms')
    .select(
      `
        id,
        code,
        status,
        host_id,
        created_at,
        updated_at,
        room_players(id)
      `
    )
    .eq('status', 'waiting')
    .order('created_at', { ascending: false })
    .returns<RoomRow[]>();

  if (error) {
    throw error;
  }

  return data.map(mapRoom);
}

export async function getRoomById(roomId: string) {
  const { data, error } = await supabase
    .from('rooms')
    .select(
      `
        id,
        code,
        status,
        host_id,
        created_at,
        updated_at,
        room_players(id)
      `
    )
    .eq('id', roomId)
    .single<RoomRow>();

  if (error) {
    throw error;
  }

  return mapRoom(data);
}

export async function createRoom(hostId: string, requestedCode?: string) {
  const code = normalizeRoomCode(requestedCode || createRoomCode());

  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .insert({
      code,
      host_id: hostId,
      status: 'waiting',
    })
    .select('id, code, status, host_id, created_at, updated_at')
    .single<RoomRow>();

  if (roomError) {
    throw roomError;
  }

  const { error: playerError } = await supabase.from('room_players').insert({
    room_id: room.id,
    user_id: hostId,
    seat: 'player_1',
    ready: false,
    connected: true,
  });

  if (playerError) {
    throw playerError;
  }

  return mapRoom({ ...room, room_players: [{ id: hostId }] });
}

export function subscribeToRooms(onChange: () => void): RealtimeChannel {
  return supabase
    .channel('lobby:rooms')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rooms',
      },
      onChange
    )
    .subscribe();
}

export function subscribeToRoom(
  roomId: string,
  onChange: () => void,
  onStatusChange?: (status: RealtimeConnectionStatus) => void
): RealtimeChannel {
  return supabase
    .channel(`room:${roomId}:state`)
    .on(
      'postgres_changes',
      {
        event: '*',
        filter: `id=eq.${roomId}`,
        schema: 'public',
        table: 'rooms',
      },
      onChange
    )
    .subscribe((status) => {
      onStatusChange?.(mapRealtimeStatus(status));
    });
}

export async function getRoomPlayers(roomId: string) {
  const { data, error } = await supabase
    .from('room_players')
    .select(
      `
        id,
        user_id,
        seat,
        ready,
        connected,
        joined_at,
        profiles(username, avatar_url)
      `
    )
    .eq('room_id', roomId)
    .order('seat', { ascending: true })
    .returns<RoomPlayerRow[]>();

  if (error) {
    throw error;
  }

  return data.map(mapRoomPlayer);
}

export async function getRoomPlayerReadyStatus(roomId: string) {
  const players = await getRoomPlayers(roomId);

  return mapRoomReadyStatus(players);
}

// Alias temporal para no romper llamadas mientras corregimos el typo.
export const getRoomplayerReadySatus = getRoomPlayerReadyStatus;

export function subscribeToRoomPlayers(
  roomId: string,
  onChange: () => void,
  onStatusChange?: (status: RealtimeConnectionStatus) => void
): RealtimeChannel {
  return supabase
    .channel(`room:${roomId}:players`)
    .on(
      'postgres_changes',
      {
        event: '*',
        filter: `room_id=eq.${roomId}`,
        schema: 'public',
        table: 'room_players',
      },
      onChange
    )
    .subscribe((status) => {
      onStatusChange?.(mapRealtimeStatus(status));
    });
}

export function subscribeToRoomPresence(
  roomId: string,
  userId: string,
  onSync: (players: RoomPresencePlayer[]) => void,
  onStatusChange?: (status: RealtimeConnectionStatus) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`room:${roomId}:presence`, {
      config: {
        presence: {
          key: userId,
        },
      },
    })
    .on('presence', { event: 'sync' }, () => {
      const presenceState = channel.presenceState<RoomPresencePlayer>();
      const players = Object.values(presenceState).flat();

      onSync(players);
    })
    .subscribe(async (status) => {
      const mappedStatus = mapRealtimeStatus(status);
      onStatusChange?.(mappedStatus);

      if (mappedStatus === 'subscribed') {
        await channel.track({
          onlineAt: new Date().toISOString(),
          userId,
        });
      }
    });

  return channel;
}

export async function enterRoom(roomId: string, userId: string) {
  const { data: players, error: playersError } = await supabase
    .from('room_players')
    .select('user_id, seat')
    .eq('room_id', roomId)
    .returns<RoomSeatRow[]>();

  if (playersError) {
    throw playersError;
  }

  const alreadyJoined = players.some((player) => player.user_id === userId);

  if (alreadyJoined) {
    return { alreadyJoined: true, roomId };
  }

  if (players.length >= 2) {
    throw new Error('Room is full.');
  }

  const occupiedSeats = new Set(players.map((player) => player.seat));
  const seat = occupiedSeats.has('player_1') ? 'player_2' : 'player_1';

  const { error } = await supabase.from('room_players').insert({
    room_id: roomId,
    user_id: userId,
    seat,
    ready: false,
    connected: true,
  });

  if (error) {
    throw error;
  }

  return { alreadyJoined: false, roomId };
}

export async function leaveRoom(roomId: string, userId: string) {
  const { error } = await supabase
    .from('room_players')
    .delete()
    .eq('room_id', roomId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}

export async function setRoomPlayerReady(
  roomId: string,
  userId: string,
  ready: boolean
) {
  const { error } = await supabase
    .from('room_players')
    .update({ ready })
    .eq('room_id', roomId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}

export async function setRoomPlayerConnected(
  roomId: string,
  userId: string,
  connected: boolean
) {
  const { error } = await supabase
    .from('room_players')
    .update({ connected })
    .eq('room_id', roomId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}

export async function getMatchByRoomId(roomId: string) {
  const { data, error } = await supabase
    .from('matches')
    .select('id, room_id, player_1_id, player_2_id, status, started_at')
    .eq('room_id', roomId)
    .maybeSingle<MatchRow>();

  if (error) {
    throw error;
  }

  return data ? mapMatch(data) : null;
}

export function normalizeRoomCode(code: string) {
  return code.trim().replace(/\s+/g, '-').toUpperCase();
}

export async function startMatchFromRoom(roomId: string) {
  const players = await getRoomPlayers(roomId);
  const playerOne = players.find((player) => player.seat === 'player_1');
  const playerTwo = players.find((player) => player.seat === 'player_2');

  if (!playerOne || !playerTwo) {
    throw new Error('Room needs exactly 2 players before starting a match.');
  }

  if (!playerOne.ready || !playerTwo.ready) {
    throw new Error('Both players must be ready before starting a match.');
  }

  const { data: existingMatch, error: existingMatchError } = await supabase
    .from('matches')
    .select('id, room_id, player_1_id, player_2_id, status, started_at')
    .eq('room_id', roomId)
    .maybeSingle<MatchRow>();

  if (existingMatchError) {
    throw existingMatchError;
  }

  if (existingMatch) {
    await markRoomAsPlaying(roomId);
    return mapMatch(existingMatch);
  }

  const { data: match, error: matchError } = await supabase
    .from('matches')
    .insert({
      player_1_id: playerOne.userId,
      player_2_id: playerTwo.userId,
      room_id: roomId,
    })
    .select('id, room_id, player_1_id, player_2_id, status, started_at')
    .single<MatchRow>();

  if (matchError) {
    if (isUniqueRoomMatchError(matchError)) {
      const currentMatch = await getMatchByRoomId(roomId);

      if (currentMatch) {
        return currentMatch;
      }
    }

    throw matchError;
  }

  await markRoomAsPlaying(roomId);

  return mapMatch(match);
}

function createRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function mapRoom(row: RoomRow): LobbyRoom {
  return {
    id: row.id,
    code: row.code,
    status: row.status,
    hostId: row.host_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    playerCount: row.room_players?.length ?? 0,
  };
}

function mapRoomPlayer(row: RoomPlayerRow): RoomPlayer {
  return {
    id: row.id,
    userId: row.user_id,
    username: row.profiles?.username ?? 'Unknown player',
    avatarUrl: row.profiles?.avatar_url ?? null,
    seat: row.seat,
    ready: row.ready,
    connected: row.connected,
    joinedAt: row.joined_at,
  };
}

function mapMatch(row: MatchRow): Match {
  return {
    id: row.id,
    player1Id: row.player_1_id,
    player2Id: row.player_2_id,
    roomId: row.room_id,
    startedAt: row.started_at,
    status: row.status,
  };
}

async function markRoomAsPlaying(roomId: string) {
  const { error } = await supabase
    .from('rooms')
    .update({ status: 'playing' })
    .eq('id', roomId);

  if (error) {
    throw error;
  }
}

function mapRoomReadyStatus(players: RoomPlayer[]): RoomReadyStatus {
  const readyCount = players.filter((player) => player.ready).length;

  return {
    allReady: players.length === 2 && readyCount === 2,
    playerCount: players.length,
    readyCount,
    players: players.map((player) => ({
      ready: player.ready,
      seat: player.seat,
      userId: player.userId,
      username: player.username,
    })),
  };
}

function mapRealtimeStatus(status: string): RealtimeConnectionStatus {
  if (status === 'SUBSCRIBED') {
    return 'subscribed';
  }

  if (status === 'TIMED_OUT') {
    return 'timed_out';
  }

  if (status === 'CLOSED') {
    return 'closed';
  }

  if (status === 'CHANNEL_ERROR') {
    return 'channel_error';
  }

  return 'connecting';
}

function isUniqueRoomMatchError(error: { code?: string; message?: string }) {
  return (
    error.code === '23505' ||
    error.message?.includes('matches_room_id_key') ||
    error.message?.toLowerCase().includes('duplicate')
  );
}
