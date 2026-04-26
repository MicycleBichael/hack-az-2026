import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export interface Course {
  id: string;
  user_id: string;
  name: string;
  code?: string;
  semester?: string;
  instructor?: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export function useCourses() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["courses", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("user_id", user?.id || "")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Course[];
    },
    enabled: !!user?.id,
  });
}

export function useCreateCourse() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (course: Omit<Course, "id" | "user_id" | "created_at" | "updated_at">) => {
      if (!user?.id) throw new Error("You must be signed in to create a course.");
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.access_token) {
        throw new Error("Auth session missing. Sign out, refresh, and sign in again.");
      }
      const { data, error } = await supabase
        .from("courses")
        .insert([{ ...course, user_id: user.id }])
        .select();

      if (error) throw error;
      return data[0] as Course;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses", user?.id] });
    },
  });
}

export function useUpdateCourse() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (course: Course) => {
      const { data, error } = await supabase
        .from("courses")
        .update(course)
        .eq("id", course.id)
        .select();

      if (error) throw error;
      return data[0] as Course;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses", user?.id] });
    },
  });
}

export function useDeleteCourse() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", courseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses", user?.id] });
    },
  });
}
