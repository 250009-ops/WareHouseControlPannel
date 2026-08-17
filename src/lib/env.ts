export function getPanelEmail() {
  return (
    process.env.PANEL_EMAIL ||
    process.env.NEXT_PUBLIC_PANEL_EMAIL ||
    "makatbcounselor@gmail.com"
  );
}

export function getPanelPassword() {
  return process.env.PANEL_PASSWORD || "13-makatbcounselor";
}

export function getAuthSecret() {
  return (
    process.env.AUTH_SECRET ||
    "41a2cd88d5ad8de2b4f050726184f72f7eec891568947828e97e9cb11d5b8cec"
  );
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
}

export function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
}

export function getSupabaseServiceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function isSupabaseAdminConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseServiceKey());
}
