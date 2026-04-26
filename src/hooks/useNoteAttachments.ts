import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export interface NoteAttachment {
  id: string;
  user_id: string;
  note_id: string;
  path: string;
  filename: string;
  content_type?: string | null;
  size_bytes?: number | null;
  created_at: string;
}

export function useNoteAttachments(noteId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["note_attachments", user?.id, noteId],
    queryFn: async () => {
      if (!noteId) return [];
      const { data, error } = await supabase
        .from("note_attachments")
        .select("*")
        .eq("user_id", user?.id || "")
        .eq("note_id", noteId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as NoteAttachment[];
    },
    enabled: !!user?.id && !!noteId,
  });
}

export function useDeleteNoteAttachment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ attachmentId, path }: { attachmentId: string; path: string }) => {
      // Best-effort delete storage object first.
      await supabase.storage.from("notes").remove([path]);
      const { error } = await supabase.from("note_attachments").delete().eq("id", attachmentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note_attachments", user?.id] });
    },
  });
}

export async function createSignedAttachmentUrl(path: string) {
  const { data, error } = await supabase.storage.from("notes").createSignedUrl(path, 60 * 5);
  if (error) throw error;
  return data.signedUrl;
}

