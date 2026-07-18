export interface PlayerProfile {
  id: string;
  username: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileRow {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
