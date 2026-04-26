export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (error instanceof Error && error.message) return error.message;

  // Supabase errors are often plain objects with a `message` field.
  if (typeof error === "object" && "message" in error) {
    const msg = (error as any).message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return fallback;
  }
}

