import { Navigate } from "react-router-dom";
import { CalendarDays, CheckCircle2, FileText, GraduationCap, Sparkles, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useCourses } from "@/hooks/useCourses";
import { useAssignments } from "@/hooks/useAssignments";
import { useNotes } from "@/hooks/useNotes";
import { cn } from "@/lib/utils";

function formatDueLabel(iso?: string) {
  if (!iso) return "No due date";
  const d = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays === -1) return "Due yesterday";
  if (diffDays > 1) return `Due in ${diffDays} days`;
  return `Overdue by ${Math.abs(diffDays)} days`;
}

export default function AppHome() {
  const { loading, user, profile } = useAuth();
  const { data: courses } = useCourses();
  const { data: assignments } = useAssignments();
  const { data: notes } = useNotes();

  if (loading) return <div className="p-6 text-foreground">Loading your study workspace…</div>;
  if (!user) return <Navigate to="/" replace />;

  const displayName = profile?.display_name || user.user_metadata?.full_name || user.email || "Student";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const firstName = displayName.split(" ")[0] || displayName;

  const upcoming = (assignments ?? [])
    .filter((a) => !a.completed)
    .slice()
    .sort((a, b) => {
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    })
    .slice(0, 3);

  const recentNotes = (notes ?? []).slice(0, 3);

  const hasAnyData = (courses?.length ?? 0) > 0 || (assignments?.length ?? 0) > 0 || (notes?.length ?? 0) > 0;

  return (
    <div className="space-y-4">
      <section className="briefing-panel rounded-md p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="stamp-label mb-3"><Sparkles className="mr-1 h-3.5 w-3.5" /> Signed-in plan</div>
              <h2 className="max-w-3xl text-3xl font-black tracking-tight text-foreground">Welcome back, {firstName}.</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Add courses, deadlines, and notes — then Wildcat Recall can turn them into a daily plan (AI later).
              </p>
            </div>
            <Badge className="w-fit bg-primary text-primary-foreground hover:bg-primary">Google account connected</Badge>
          </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
          {[
            { icon: GraduationCap, label: "Courses", value: `${courses?.length ?? 0}` },
            { icon: CalendarDays, label: "Open tasks", value: `${(assignments ?? []).filter((a) => !a.completed).length}` },
            { icon: FileText, label: "Notes", value: `${notes?.length ?? 0}` },
            {
              icon: Target,
              label: "Next due",
              value: upcoming[0]?.due_date ? new Date(upcoming[0].due_date).toLocaleDateString() : "—",
            },
          ].map(({ icon: Icon, label, value }) => (
            <Card key={label} className="rounded-md border-primary/15 bg-card shadow-none">
              <CardContent className="flex items-center gap-3 border-l-4 border-accent p-3">
                <Icon className="h-4 w-4 text-accent" />
                <div>
                  <p className="micro-label">{label}</p>
                  <p className="font-mono text-sm font-black">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
          <Card className="notebook-panel rounded-md">
            <CardHeader>
              <p className="micro-label">Personal queue</p>
              <CardTitle>Next up</CardTitle>
              <CardDescription>Upcoming assignments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcoming.length === 0 ? (
                <div className={cn("rounded-sm border border-dashed p-4 text-sm text-muted-foreground", hasAnyData ? "border-border/70" : "border-primary/25 solid-tint-primary")}>
                  No upcoming assignments yet. Add one in your Workspace.
                </div>
              ) : (
                upcoming.map((task, index) => (
                  <div key={task.id} className="priority-rail grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-sm p-3 pl-4">
                    <span className="font-mono text-xs font-black text-primary">0{index + 1}</span>
                    <div className="min-w-0">
                      <p className="truncate font-black text-foreground">{task.title}</p>
                      <p className="truncate text-sm text-muted-foreground">{formatDueLabel(task.due_date)}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {task.priority}
                    </Badge>
                  </div>
                ))
              )}
              <p className="text-xs text-muted-foreground">Use the tabs above to add or edit items.</p>
            </CardContent>
          </Card>

          <Card className="notebook-panel rounded-md">
            <CardHeader>
              <p className="micro-label">Profile-backed</p>
              <CardTitle>Your student profile</CardTitle>
              <CardDescription>Created automatically from Google sign-in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="solid-panel rounded-sm border border-border/70 p-3">
                <p className="text-xs font-bold text-muted-foreground">Email</p>
                <p className="font-semibold text-foreground">{profile?.email || user.email}</p>
              </div>
              <div className="solid-panel rounded-sm border border-border/70 p-3">
                <p className="text-xs font-bold text-muted-foreground">Courses</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(courses ?? []).slice(0, 6).map((course) => (
                    <Badge key={course.id} variant="outline">
                      {course.code || course.name}
                    </Badge>
                  ))}
                  {(courses?.length ?? 0) === 0 ? <span className="text-sm text-muted-foreground">No courses yet</span> : null}
                </div>
              </div>
            </CardContent>
          </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
          <Card className="notebook-panel rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Recent notes</CardTitle>
              <CardDescription>Latest notes you’ve added.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentNotes.length === 0 ? (
                <div className="rounded-sm border border-dashed border-border/70 p-4 text-sm text-muted-foreground">No notes yet.</div>
              ) : (
                recentNotes.map((n) => (
                  <div key={n.id} className="data-row rounded-sm border border-border/70 solid-panel p-3">
                    <p className="font-semibold text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="notebook-panel rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Completed</CardTitle>
              <CardDescription>Finished assignments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {((assignments ?? []).filter((a) => a.completed).slice(0, 3)).length === 0 ? (
                <div className="rounded-sm border border-dashed border-border/70 p-4 text-sm text-muted-foreground">Nothing completed yet.</div>
              ) : (
                (assignments ?? [])
                  .filter((a) => a.completed)
                  .slice(0, 3)
                  .map((a) => (
                    <div key={a.id} className="data-row rounded-sm border border-border/70 solid-panel p-3">
                      <p className="font-semibold text-foreground">{a.title}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
      </section>
    </div>
  );
}
