import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export interface MasteryScore {
  id: string;
  user_id: string;
  topic_id: string;
  mastery_percentage: number;
  last_reviewed?: string;
  next_review?: string;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export function useMasteryScores(topicId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["mastery_scores", user?.id, topicId],
    queryFn: async () => {
      let query = supabase
        .from("mastery_scores")
        .select("*")
        .eq("user_id", user?.id || "");

      if (topicId) {
        query = query.eq("topic_id", topicId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as MasteryScore[];
    },
    enabled: !!user?.id,
  });
}

export function useCreateMasteryScore() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (score: Omit<MasteryScore, "id" | "user_id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("mastery_scores")
        .insert([{ ...score, user_id: user?.id }])
        .select();

      if (error) throw error;
      return data[0] as MasteryScore;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["mastery_scores"] });
      queryClient.invalidateQueries({ queryKey: ["mastery_scores", user?.id, data.topic_id] });
    },
  });
}

export function useUpdateMasteryScore() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (score: MasteryScore) => {
      const { data, error } = await supabase
        .from("mastery_scores")
        .update(score)
        .eq("id", score.id)
        .select();

      if (error) throw error;
      return data[0] as MasteryScore;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["mastery_scores"] });
      queryClient.invalidateQueries({ queryKey: ["mastery_scores", user?.id, data.topic_id] });
    },
  });
}

export function useDeleteMasteryScore() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scoreId: string) => {
      const { error } = await supabase.from("mastery_scores").delete().eq("id", scoreId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mastery_scores"] });
    },
  });
}
