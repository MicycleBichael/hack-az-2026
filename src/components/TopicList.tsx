import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { useTopics, useDeleteTopic, type Topic } from "@/hooks/useTopics";
import { useCourses } from "@/hooks/useCourses";
import { useToast } from "@/hooks/use-toast";
import { TopicForm } from "@/components/TopicForm";

export function TopicList() {
  const { toast } = useToast();
  const { data: topics, isLoading } = useTopics();
  const { data: courses } = useCourses();
  const deleteMutation = useDeleteTopic();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Topic | undefined>();

  const courseById = useMemo(() => {
    const map = new Map<string, { name: string; code?: string; color?: string }>();
    (courses ?? []).forEach((c) => map.set(c.id, { name: c.name, code: c.code ?? undefined, color: c.color }));
    return map;
  }, [courses]);

  const handleDelete = async (topicId: string) => {
    try {
      await deleteMutation.mutateAsync(topicId);
      toast({ description: "Topic deleted successfully" });
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to delete topic",
      });
    }
  };

  if (isLoading) return <div className="py-8 text-center">Loading topics…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Topics</h2>
          <p className="text-sm text-muted-foreground">Manually define the topics you want to practice (mastery scoring can build on this later).</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(undefined)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Topic
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Topic" : "Create New Topic"}</DialogTitle>
            </DialogHeader>
            <TopicForm
              topic={editing}
              onSuccess={() => {
                setOpen(false);
                setEditing(undefined);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {!topics || topics.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">No topics yet. Add one to get started!</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {topics.map((t) => {
            const course = courseById.get(t.course_id);
            return (
              <Card key={t.id} style={{ borderLeftColor: course?.color, borderLeftWidth: course?.color ? "4px" : undefined }}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="truncate">{t.name}</CardTitle>
                      <CardDescription>
                        {course ? (course.code ? `${course.code} — ${course.name}` : course.name) : "Unknown course"}
                      </CardDescription>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setEditing(t)} title="Edit">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                          <DialogHeader>
                            <DialogTitle>Edit Topic</DialogTitle>
                          </DialogHeader>
                          <TopicForm topic={t} onSuccess={() => setEditing(undefined)} />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(t.id)}
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
                    <Badge variant="secondary">{new Date(t.created_at).toLocaleDateString()}</Badge>
                  </div>
                  {t.description ? <p className="text-sm text-muted-foreground whitespace-pre-wrap">{t.description}</p> : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

