// ── API Health ────────────────────────────────────────────────────────────────
export type ApiHealth = {
  ok: true;
  service: string;
  timestamp: string;
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export type AuthProvider = 'google';

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  picture?: string;
};

export type AuthTokenResponse = {
  token: string;
  user: AuthUser;
};

// ── Waitlist ──────────────────────────────────────────────────────────────────
export type WaitlistRequest = {
  email: string;
};

export type WaitlistResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      error: string;
      status?: 'duplicate' | 'invalid' | 'error';
    };

// ── Storage ───────────────────────────────────────────────────────────────────
export type PresignRequest = {
  filename: string;
  contentType: string;
};

export type PresignResponse = {
  uploadToken: string;
  key: string;
  uploadUrl: string;
  expiresAt: string;
};

export type StorageUploadResult = {
  success: true;
  key: string;
  size: number;
};

// ── Projects (stub — will grow as the product evolves) ────────────────────────
export type ProjectStatus = 'draft' | 'processing' | 'ready' | 'error';

export type Project = {
  id: string;
  userId: string;
  name: string;
  status: ProjectStatus;
  storageKey?: string;
  createdAt: string;
  updatedAt: string;
};