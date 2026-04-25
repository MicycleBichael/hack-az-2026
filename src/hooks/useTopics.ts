import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export interface Topic {
  id: string;
  user_id: string;
  course_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export function useTopics(courseId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["topics", user?.id, courseId],
    queryFn: async () => {
      let query = supabase
        .from("topics")
        .select("*")
        .eq("user_id", user?.id || "");

      if (courseId) {
        query = query.eq("course_id", courseId);
      }

      const { data, error } = await query.order("name", { ascending: true });

      if (error) throw error;
      return data as Topic[];
    },
    enabled: !!user?.id,
  });
}

export function useCreateTopic() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (topic: Omit<Topic, "id" | "user_id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("topics")
        .insert([{ ...topic, user_id: user?.id }])
        .select();

      if (error) throw error;
      return data[0] as Topic;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      queryClient.invalidateQueries({ queryKey: ["topics", user?.id, data.course_id] });
    },
  });
}

export function useUpdateTopic() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (topic: Topic) => {
      const { data, error } = await supabase
        .from("topics")
        .update(topic)
        .eq("id", topic.id)
        .select();

      if (error) throw error;
      return data[0] as Topic;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      queryClient.invalidateQueries({ queryKey: ["topics", user?.id, data.course_id] });
    },
  });
}

export function useDeleteTopic() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (topicId: string) => {
      const { error } = await supabase.from("topics").delete().eq("id", topicId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });
}
