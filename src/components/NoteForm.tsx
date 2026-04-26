import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateNote, useUpdateNote, type Note } from "@/hooks/useNotes";
import { useCourses } from "@/hooks/useCourses";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/errors";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { createSignedAttachmentUrl, useDeleteNoteAttachment, useNoteAttachments } from "@/hooks/useNoteAttachments";
import { Trash2 } from "lucide-react";

interface NoteFormProps {
  note?: Note;
  onSuccess?: () => void;
  courseId?: string;
}

type FormValues = {
  course_id: string;
  title: string;
  content?: string;
  topic?: string;
};

export function NoteForm({ note, onSuccess, courseId }: NoteFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: courses } = useCourses();
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();
  const { data: attachments } = useNoteAttachments(note?.id);
  const deleteAttachmentMutation = useDeleteNoteAttachment();

  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<FormValues>({
    defaultValues: {
      course_id: note?.course_id || courseId || "",
      title: note?.title || "",
      content: note?.content || "",
      topic: note?.topic || "",
    },
  });

  const canUpload = !!user?.id;
  const selectedFilesLabel = useMemo(() => (files.length ? `${files.length} file(s) selected` : "No files selected"), [files.length]);

  async function uploadFiles(noteId: string) {
    if (!user?.id) return;
    if (!files.length) return;

    for (const file of files) {
      const safeName = file.name.replaceAll("/", "_");
      const uuid = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const path = `${user.id}/${noteId}/${uuid}-${safeName}`;

      const { error: uploadError } = await supabase.storage.from("notes").upload(path, file, {
        contentType: file.type || undefined,
        upsert: false,
      });
      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("note_attachments").insert([
        {
          user_id: user.id,
          note_id: noteId,
          path,
          filename: file.name,
          content_type: file.type || null,
          size_bytes: file.size,
        },
      ]);
      if (insertError) throw insertError;
    }

    setFiles([]);
  }

  const onSubmit = async (data: FormValues) => {
    try {
      if (!data.course_id) {
        form.setError("course_id", { type: "manual", message: "Course is required" });
        return;
      }

      const payload = {
        ...data,
        content: data.content ? data.content : undefined,
        topic: data.topic ? data.topic : undefined,
      };

      if (note) {
        await updateMutation.mutateAsync({ ...note, ...payload });
        await uploadFiles(note.id);
        toast({ description: "Note updated successfully" });
      } else {
        const created = await createMutation.mutateAsync(payload);
        await uploadFiles(created.id);
        toast({ description: "Note created successfully" });
        form.reset({ ...form.getValues(), title: "", content: "", topic: "" });
      }
      onSuccess?.();
    } catch (error) {
      toast({
        variant: "destructive",
        description: getErrorMessage(error, "Failed to save note"),
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
                <Input placeholder="e.g., Lecture 7 — Cellular Respiration" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Electron Transport Chain" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Paste or type your notes…" className="min-h-40" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Attachments</p>
              <p className="text-xs text-muted-foreground">Uploads are stored in Supabase Storage (bucket: `notes`).</p>
            </div>
            <p className="text-xs text-muted-foreground">{selectedFilesLabel}</p>
          </div>
          <Input
            type="file"
            multiple
            disabled={!canUpload}
            onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
          />

          {note?.id && attachments && attachments.length > 0 ? (
            <div className="space-y-2 rounded-sm border border-border/70 bg-card p-3">
              {attachments.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    className="min-w-0 truncate text-left text-sm font-medium text-primary hover:underline"
                    onClick={async () => {
                      try {
                        const url = await createSignedAttachmentUrl(a.path);
                        window.open(url, "_blank", "noopener,noreferrer");
                      } catch (err) {
                        toast({ variant: "destructive", description: getErrorMessage(err, "Failed to open attachment") });
                      }
                    }}
                  >
                    {a.filename}
                  </button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={deleteAttachmentMutation.isPending}
                    onClick={async () => {
                      try {
                        await deleteAttachmentMutation.mutateAsync({ attachmentId: a.id, path: a.path });
                        toast({ description: "Attachment deleted" });
                      } catch (err) {
                        toast({ variant: "destructive", description: getErrorMessage(err, "Failed to delete attachment") });
                      }
                    }}
                    title="Delete attachment"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
          {note ? "Update Note" : "Create Note"}
        </Button>
      </form>
    </Form>
  );
}

