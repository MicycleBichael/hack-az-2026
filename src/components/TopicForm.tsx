import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateTopic, useUpdateTopic, type Topic } from "@/hooks/useTopics";
import { useCourses } from "@/hooks/useCourses";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/errors";

interface TopicFormProps {
  topic?: Topic;
  onSuccess?: () => void;
  courseId?: string;
}

type FormValues = {
  course_id: string;
  name: string;
  description?: string;
};

export function TopicForm({ topic, onSuccess, courseId }: TopicFormProps) {
  const { toast } = useToast();
  const { data: courses } = useCourses();
  const createMutation = useCreateTopic();
  const updateMutation = useUpdateTopic();

  const form = useForm<FormValues>({
    defaultValues: {
      course_id: topic?.course_id || courseId || "",
      name: topic?.name || "",
      description: topic?.description || "",
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
        description: data.description ? data.description : undefined,
      };

      if (topic) {
        await updateMutation.mutateAsync({ ...topic, ...payload });
        toast({ description: "Topic updated successfully" });
      } else {
        await createMutation.mutateAsync(payload);
        toast({ description: "Topic created successfully" });
        form.reset({ ...form.getValues(), name: "", description: "" });
      }
      onSuccess?.();
    } catch (error) {
      toast({
        variant: "destructive",
        description: getErrorMessage(error, "Failed to save topic"),
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Cellular Respiration" {...field} />
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
                <Textarea placeholder="Optional notes about this topic…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
          {topic ? "Update Topic" : "Create Topic"}
        </Button>
      </form>
    </Form>
  );
}

