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

export function subscribeToRoomPlayers(
  roomId: string,
  onChange: () => void
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
    .subscribe();
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

export function normalizeRoomCode(code: string) {
  return code.trim().replace(/\s+/g, '-').toUpperCase();
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
