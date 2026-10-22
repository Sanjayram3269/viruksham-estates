/**
 * Validates a return URL to prevent open-redirect vulnerabilities.
 * Only permits relative paths starting with '/admin' (excluding '/admin/login').
 */
export function getSafeRedirectPath(rawNext: string | null): string {
  if (!rawNext) return "/admin/dashboard";

  const trimmed = rawNext.trim();

  // Must start with '/admin', must not start with '//' or '\\', must not contain control chars
  if (
    trimmed.startsWith("/admin") &&
    !trimmed.startsWith("//") &&
    !trimmed.startsWith("\\") &&
    !trimmed.includes("\r") &&
    !trimmed.includes("\n") &&
    trimmed !== "/admin/login"
  ) {
    return trimmed;
  }

  return "/admin/dashboard";
}
