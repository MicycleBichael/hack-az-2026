import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateAssignment, useUpdateAssignment, type Assignment } from "@/hooks/useAssignments";
import { useCourses } from "@/hooks/useCourses";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/errors";

interface AssignmentFormProps {
  assignment?: Assignment;
  onSuccess?: () => void;
  courseId?: string;
}

type FormValues = {
  course_id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: "low" | "medium" | "high" | "urgent";
  difficulty?: number;
  estimated_hours?: number;
  completed: boolean;
};

export function AssignmentForm({ assignment, onSuccess, courseId }: AssignmentFormProps) {
  const { toast } = useToast();
  const { data: courses } = useCourses();
  const createMutation = useCreateAssignment();
  const updateMutation = useUpdateAssignment();

  const form = useForm<FormValues>({
    defaultValues: {
      course_id: assignment?.course_id || courseId || "",
      title: assignment?.title || "",
      description: assignment?.description || "",
      due_date: assignment?.due_date || "",
      priority: assignment?.priority || "medium",
      difficulty: assignment?.difficulty ?? undefined,
      estimated_hours: assignment?.estimated_hours ?? undefined,
      completed: assignment?.completed ?? false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      if (!data.course_id) {
        form.setError("course_id", { type: "manual", message: "Course is required" });
        return;
      }

      const payload = {
        ...data,
        difficulty: data.difficulty ? Number(data.difficulty) : undefined,
        estimated_hours: data.estimated_hours ? Number(data.estimated_hours) : undefined,
        due_date: data.due_date ? data.due_date : undefined,
      };

      if (assignment) {
        await updateMutation.mutateAsync({ ...assignment, ...payload });
        toast({ description: "Assignment updated successfully" });
      } else {
        await createMutation.mutateAsync(payload);
        toast({ description: "Assignment created successfully" });
        form.reset({ ...form.getValues(), title: "", description: "", due_date: "", difficulty: undefined, estimated_hours: undefined });
      }
      onSuccess?.();
    } catch (error) {
      toast({
        variant: "destructive",
        description: getErrorMessage(error, "Failed to save assignment"),
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="course_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course *</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(courses ?? []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.code ? `${c.code} — ${c.name}` : c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Problem Set 3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Optional details…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty (1–5)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    step={1}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimated_hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated hours</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
          {assignment ? "Update Assignment" : "Create Assignment"}
        </Button>
      </form>
    </Form>
  );
}

