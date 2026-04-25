import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { useCourses, useDeleteCourse, type Course } from "@/hooks/useCourses";
import { CourseForm } from "./CourseForm";
import { useToast } from "@/hooks/use-toast";

export function CourseList() {
  const { data: courses, isLoading } = useCourses();
  const deleteCourseMutation = useDeleteCourse();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>();

  const handleDelete = async (courseId: string) => {
    try {
      await deleteCourseMutation.mutateAsync(courseId);
      toast({ description: "Course deleted successfully" });
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to delete course",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading courses...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Courses</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCourse(undefined)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCourse ? "Edit Course" : "Create New Course"}</DialogTitle>
            </DialogHeader>
            <CourseForm
              course={editingCourse}
              onSuccess={() => {
                setOpen(false);
                setEditingCourse(undefined);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {!courses || courses.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No courses yet. Create one to get started!
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <Card key={course.id} style={{ borderLeftColor: course.color, borderLeftWidth: "4px" }}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{course.name}</CardTitle>
                    {course.code && <CardDescription>{course.code}</CardDescription>}
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCourse(course)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Course</DialogTitle>
                        </DialogHeader>
                        <CourseForm
                          course={course}
                          onSuccess={() => {
                            setOpen(false);
                            setEditingCourse(undefined);
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(course.id)}
                      disabled={deleteCourseMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.semester && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Semester:</span> {course.semester}
                  </p>
                )}
                {course.instructor && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Instructor:</span> {course.instructor}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
