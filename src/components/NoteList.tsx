import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { useNotes, useDeleteNote, type Note } from "@/hooks/useNotes";
import { useCourses } from "@/hooks/useCourses";
import { useToast } from "@/hooks/use-toast";
import { NoteForm } from "@/components/NoteForm";

export function NoteList() {
  const { toast } = useToast();
  const { data: notes, isLoading } = useNotes();
  const { data: courses } = useCourses();
  const deleteMutation = useDeleteNote();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Note | undefined>();

  const courseById = useMemo(() => {
    const map = new Map<string, { name: string; code?: string; color?: string }>();
    (courses ?? []).forEach((c) => map.set(c.id, { name: c.name, code: c.code ?? undefined, color: c.color }));
    return map;
  }, [courses]);

  const handleDelete = async (noteId: string) => {
    try {
      await deleteMutation.mutateAsync(noteId);
      toast({ description: "Note deleted successfully" });
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to delete note",
      });
    }
  };

  if (isLoading) return <div className="py-8 text-center">Loading notes…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Notes</h2>
          <p className="text-sm text-muted-foreground">Create notes manually (uploads/AI can come later).</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(undefined)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Note" : "Create New Note"}</DialogTitle>
            </DialogHeader>
            <NoteForm
              note={editing}
              onSuccess={() => {
                setOpen(false);
                setEditing(undefined);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {!notes || notes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">No notes yet. Add one to get started!</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {notes.map((n) => {
            const course = courseById.get(n.course_id);
            return (
              <Card key={n.id} style={{ borderLeftColor: course?.color, borderLeftWidth: course?.color ? "4px" : undefined }}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="truncate">{n.title}</CardTitle>
                      <CardDescription>
                        {course ? (course.code ? `${course.code} — ${course.name}` : course.name) : "Unknown course"}
                      </CardDescription>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setEditing(n)} title="Edit">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                          <DialogHeader>
                            <DialogTitle>Edit Note</DialogTitle>
                          </DialogHeader>
                          <NoteForm note={n} onSuccess={() => setEditing(undefined)} />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(n.id)}
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
                    {n.topic ? <Badge variant="outline">{n.topic}</Badge> : null}
                    <Badge variant="secondary">{new Date(n.created_at).toLocaleDateString()}</Badge>
                  </div>
                  {n.content ? <p className="line-clamp-4 text-sm text-muted-foreground whitespace-pre-wrap">{n.content}</p> : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

