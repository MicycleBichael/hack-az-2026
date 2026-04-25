import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateCourse, useUpdateCourse, type Course } from "@/hooks/useCourses";
import { useToast } from "@/hooks/use-toast";

interface CourseFormProps {
  course?: Course;
  onSuccess?: () => void;
}

const colors = [
  "#3B82F6", // blue
  "#EF4444", // red
  "#10B981", // green
  "#F59E0B", // amber
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#6366F1", // indigo
];

export function CourseForm({ course, onSuccess }: CourseFormProps) {
  const { toast } = useToast();
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();

  const form = useForm({
    defaultValues: {
      name: course?.name || "",
      code: course?.code || "",
      semester: course?.semester || "",
      instructor: course?.instructor || "",
      color: course?.color || colors[0],
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (course) {
        await updateMutation.mutateAsync({ ...course, ...data });
        toast({ description: "Course updated successfully" });
      } else {
        await createMutation.mutateAsync(data);
        toast({ description: "Course created successfully" });
        form.reset();
      }
      onSuccess?.();
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to save course",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Introduction to Biology" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g., BIO 181" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="semester"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Spring 2026" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instructor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructor</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Dr. Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => field.onChange(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        field.value === color ? "border-black" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
          {course ? "Update Course" : "Create Course"}
        </Button>
      </form>
    </Form>
  );
}
