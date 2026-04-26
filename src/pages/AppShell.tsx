import { Navigate } from "react-router-dom";
import { BookOpen, ClipboardList, FileText, GraduationCap, LayoutDashboard, LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { CourseList } from "@/components/CourseList";
import { AssignmentList } from "@/components/AssignmentList";
import { NoteList } from "@/components/NoteList";
import { TopicList } from "@/components/TopicList";
import AppHome from "@/pages/AppHome";
import { useSearchParams } from "react-router-dom";

const TAB_VALUES = ["dashboard", "courses", "assignments", "notes", "topics"] as const;
type TabValue = (typeof TAB_VALUES)[number];

function normalizeTab(value: string | null): TabValue {
  if (!value) return "dashboard";
  return (TAB_VALUES as readonly string[]).includes(value) ? (value as TabValue) : "dashboard";
}

export default function AppShell() {
  const { loading, user, profile, signOut } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = normalizeTab(searchParams.get("tab"));

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
        <Tabs
          value={tab}
          onValueChange={(next) => setSearchParams({ tab: next })}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="courses" className="gap-2">
              <GraduationCap className="h-4 w-4" /> Courses
            </TabsTrigger>
            <TabsTrigger value="assignments" className="gap-2">
              <ClipboardList className="h-4 w-4" /> Assignments
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-2">
              <FileText className="h-4 w-4" /> Notes
            </TabsTrigger>
            <TabsTrigger value="topics" className="gap-2">
              <BookOpen className="h-4 w-4" /> Topics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AppHome />
          </TabsContent>
          <TabsContent value="courses">
            <CourseList />
          </TabsContent>
          <TabsContent value="assignments">
            <AssignmentList />
          </TabsContent>
          <TabsContent value="notes">
            <NoteList />
          </TabsContent>
          <TabsContent value="topics">
            <TopicList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

