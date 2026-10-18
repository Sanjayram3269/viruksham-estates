/**
 * Result returned by administrator sign-out operations.
 */
export interface SignOutExecutionResult {
  success: boolean;
  error: string | null;
}

/**
 * Executes administrator sign-out against Supabase Auth.
 * Ensures failures provide actionable user feedback without redirecting away,
 * while successful terminations signal that redirection can proceed safely.
 */
export async function executeAdminSignOut(
  signOutFn: () => Promise<{ error: { message?: string } | null }>
): Promise<SignOutExecutionResult> {
  try {
    const { error } = await signOutFn();

    if (error) {
      return {
        success: false,
        error:
          `${error.message || "Failed to terminate session on server"}. ` +
          "Refresh the page and try again, or close this browser tab.",
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      error:
        `${err instanceof Error ? err.message : "Unexpected sign-out failure"}. ` +
        "Refresh the page and try again.",
    };
  }
}
