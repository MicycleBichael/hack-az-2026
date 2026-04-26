import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export interface Note {
  id: string;
  user_id: string;
  course_id: string;
  title: string;
  content?: string;
  topic?: string;
  created_at: string;
  updated_at: string;
}

export function useNotes(courseId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["notes", user?.id, courseId],
    queryFn: async () => {
      let query = supabase
        .from("notes")
        .select("*")
        .eq("user_id", user?.id || "");

      if (courseId) {
        query = query.eq("course_id", courseId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data as Note[];
    },
    enabled: !!user?.id,
  });
}

export function useCreateNote() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: Omit<Note, "id" | "user_id" | "created_at" | "updated_at">) => {
      if (!user?.id) throw new Error("You must be signed in to create a note.");
      const { data, error } = await supabase
        .from("notes")
        .insert([{ ...note, user_id: user.id }])
        .select();

      if (error) throw error;
      return data[0] as Note;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", user?.id, data.course_id] });
    },
  });
}

export function useUpdateNote() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: Note) => {
      const { data, error } = await supabase
        .from("notes")
        .update(note)
        .eq("id", note.id)
        .select();

      if (error) throw error;
      return data[0] as Note;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", user?.id, data.course_id] });
    },
  });
}

export function useDeleteNote() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", noteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
