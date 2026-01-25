const TOKEN_KEY = 'rme_admin_token';
const ROLE_KEY = 'rme_admin_role';

export type AdminRole = 'SUPER_ADMIN' | 'AGENT';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string, role: AdminRole) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(ROLE_KEY, role);
}

export function clearAdminToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(ROLE_KEY);
}

export function getAdminRole(): AdminRole | null {
  if (typeof window === 'undefined') return null;
  const role = window.localStorage.getItem(ROLE_KEY);
  if (role === 'SUPER_ADMIN' || role === 'AGENT') return role;
  return null;
}
