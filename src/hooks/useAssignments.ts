import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export interface Assignment {
  id: string;
  user_id: string;
  course_id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: "low" | "medium" | "high" | "urgent";
  difficulty?: number;
  estimated_hours?: number;
  completed: boolean;
  completion_date?: string;
  created_at: string;
  updated_at: string;
}

export function useAssignments(courseId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["assignments", user?.id, courseId],
    queryFn: async () => {
      let query = supabase
        .from("assignments")
        .select("*")
        .eq("user_id", user?.id || "");

      if (courseId) {
        query = query.eq("course_id", courseId);
      }

      const { data, error } = await query.order("due_date", { ascending: true });

      if (error) throw error;
      return data as Assignment[];
    },
    enabled: !!user?.id,
  });
}

export function useCreateAssignment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignment: Omit<Assignment, "id" | "user_id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("assignments")
        .insert([{ ...assignment, user_id: user?.id }])
        .select();

      if (error) throw error;
      return data[0] as Assignment;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      queryClient.invalidateQueries({ queryKey: ["assignments", user?.id, data.course_id] });
    },
  });
}

export function useUpdateAssignment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignment: Assignment) => {
      const { data, error } = await supabase
        .from("assignments")
        .update(assignment)
        .eq("id", assignment.id)
        .select();

      if (error) throw error;
      return data[0] as Assignment;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      queryClient.invalidateQueries({ queryKey: ["assignments", user?.id, data.course_id] });
    },
  });
}

export function useDeleteAssignment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase.from("assignments").delete().eq("id", assignmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
}
