import { Navigate } from "react-router-dom";
import { CalendarDays, CheckCircle2, LogOut, Sparkles, Target, UploadCloud, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const appTasks = [
  { title: "Review Cellular Respiration", detail: "BIO 181 exam in 4 days", label: "High impact" },
  { title: "Finish CHEM problem set", detail: "Due tomorrow · 75 min", label: "Urgent" },
  { title: "Draft ENGL outline", detail: "Due Friday · quick win", label: "Light lift" },
];

const courses = ["BIO 181", "CHEM 151", "MATH 122A", "ENGL 102"];

export default function AppHome() {
  const { loading, user, profile, signOut } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-background p-6 text-foreground">Loading your study workspace…</div>;
  }

  if (!user) return <Navigate to="/" replace />;

  const displayName = profile?.display_name || user.user_metadata?.full_name || user.email || "Student";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b-2 border-primary/15 bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <p className="micro-label">Wildcat Recall</p>
            <h1 className="text-xl font-black tracking-tight">My Study Workspace</h1>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-md border border-primary/20">
              <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
              <AvatarFallback className="rounded-md font-black">{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-black">{displayName}</p>
              <p className="text-xs text-muted-foreground">{profile?.school || "University of Arizona"}</p>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-4 px-4 py-5 sm:px-6 lg:px-8">
        <section className="briefing-panel rounded-md p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="stamp-label mb-3"><Sparkles className="mr-1 h-3.5 w-3.5" /> Signed-in plan</div>
              <h2 className="max-w-3xl text-3xl font-black tracking-tight text-foreground">Welcome back, {displayName.split(" ")[0]}.</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Your real workspace is ready. This currently starts with seeded study data while profile-backed notes and mastery history are added next.
              </p>
            </div>
            <Badge className="w-fit bg-primary text-primary-foreground hover:bg-primary">Google account connected</Badge>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-4">
          {[
            { icon: Zap, label: "Streak", value: "5 days" },
            { icon: CheckCircle2, label: "Reviews", value: "4 this week" },
            { icon: Target, label: "Focus", value: "BIO 181" },
            { icon: CalendarDays, label: "Next due", value: "CHEM tomorrow" },
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
              <CardTitle>Today’s ranked tasks</CardTitle>
              <CardDescription>Starter plan for your signed-in workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {appTasks.map((task, index) => (
                <div key={task.title} className="priority-rail grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-sm p-3 pl-4">
                  <span className="font-mono text-xs font-black text-primary">0{index + 1}</span>
                  <div>
                    <p className="font-black text-foreground">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.detail}</p>
                  </div>
                  <Badge variant="outline">{task.label}</Badge>
                </div>
              ))}
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
                  {courses.map((course) => <Badge key={course} variant="outline">{course}</Badge>)}
                </div>
              </div>
              <div className="solid-tint-primary rounded-sm border border-primary/20 p-3">
                <UploadCloud className="mb-2 h-5 w-5 text-primary" />
                <p className="text-sm font-semibold">Next: connect uploads, notes, and mastery history to this account.</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
