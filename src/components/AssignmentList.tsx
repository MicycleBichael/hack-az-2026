import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit2, CheckCircle2 } from "lucide-react";
import { useAssignments, useDeleteAssignment, useUpdateAssignment, type Assignment } from "@/hooks/useAssignments";
import { useCourses } from "@/hooks/useCourses";
import { useToast } from "@/hooks/use-toast";
import { AssignmentForm } from "@/components/AssignmentForm";

const priorityLabel: Record<Assignment["priority"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export function AssignmentList() {
  const { toast } = useToast();
  const { data: assignments, isLoading } = useAssignments();
  const { data: courses } = useCourses();
  const deleteMutation = useDeleteAssignment();
  const updateMutation = useUpdateAssignment();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | undefined>();

  const courseById = useMemo(() => {
    const map = new Map<string, { name: string; code?: string; color?: string }>();
    (courses ?? []).forEach((c) => map.set(c.id, { name: c.name, code: c.code ?? undefined, color: c.color }));
    return map;
  }, [courses]);

  const handleDelete = async (assignmentId: string) => {
    try {
      await deleteMutation.mutateAsync(assignmentId);
      toast({ description: "Assignment deleted successfully" });
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to delete assignment",
      });
    }
  };

  const toggleComplete = async (a: Assignment) => {
    try {
      const nextCompleted = !a.completed;
      await updateMutation.mutateAsync({
        ...a,
        completed: nextCompleted,
        completion_date: nextCompleted ? new Date().toISOString() : undefined,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to update assignment",
      });
    }
  };

  if (isLoading) return <div className="py-8 text-center">Loading assignments…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Assignments</h2>
          <p className="text-sm text-muted-foreground">Add homework, quizzes, tests, exams, projects—anything with a due date.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(undefined)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Assignment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Assignment" : "Create New Assignment"}</DialogTitle>
            </DialogHeader>
            <AssignmentForm
              assignment={editing}
              onSuccess={() => {
                setOpen(false);
                setEditing(undefined);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {!assignments || assignments.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">No assignments yet. Add one to get started!</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {assignments.map((a) => {
            const course = courseById.get(a.course_id);
            return (
              <Card key={a.id} style={{ borderLeftColor: course?.color, borderLeftWidth: course?.color ? "4px" : undefined }}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="truncate">{a.title}</CardTitle>
                      <CardDescription>
                        {course ? (course.code ? `${course.code} — ${course.name}` : course.name) : "Unknown course"}
                      </CardDescription>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleComplete(a)} title="Mark complete">
                        <CheckCircle2 className={a.completed ? "h-4 w-4 text-success" : "h-4 w-4 text-muted-foreground"} />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setEditing(a)} title="Edit">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Assignment</DialogTitle>
                          </DialogHeader>
                          <AssignmentForm assignment={a} onSuccess={() => setEditing(undefined)} />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(a.id)}
                        disabled={deleteMutation.isPending}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{priorityLabel[a.priority]}</Badge>
                    {a.due_date && <Badge variant="secondary">Due {new Date(a.due_date).toLocaleDateString()}</Badge>}
                    {typeof a.difficulty === "number" && <Badge variant="secondary">Difficulty {a.difficulty}/5</Badge>}
                    {typeof a.estimated_hours === "number" && <Badge variant="secondary">{a.estimated_hours}h</Badge>}
                    {a.completed && <Badge className="bg-success text-success-foreground hover:bg-success">Completed</Badge>}
                  </div>
                  {a.description ? <p className="text-sm text-muted-foreground">{a.description}</p> : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

