import type { ReactNode } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  Medal,
  MessageSquareText,
  Sparkles,
  Target,
  UploadCloud,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const navItems = [
  { label: "Dashboard", path: "/demo" },
  { label: "AI Review", path: "/demo/ai-review" },
  { label: "Weekly Plan", path: "/demo/weekly-plan" },
  { label: "Notes", path: "/demo/notes" },
  { label: "Resources", path: "/demo/resources" },
] as const;

const courses = [
  { code: "BIO 181", name: "Introductory Biology", accent: "bg-primary" },
  { code: "CHEM 151", name: "General Chemistry", accent: "bg-accent" },
  { code: "MATH 122A", name: "Functions for Calculus", accent: "bg-success" },
  { code: "ENGL 102", name: "First-Year Composition", accent: "bg-warning" },
];

const topics = [
  { name: "Cellular Respiration", course: "BIO 181", mastery: 42, last: "Yesterday", next: "Today", status: "Needs review" },
  { name: "Photosynthesis", course: "BIO 181", mastery: 67, last: "2 days ago", next: "Tomorrow", status: "Developing" },
  { name: "Stoichiometry", course: "CHEM 151", mastery: 58, last: "3 days ago", next: "Today", status: "Developing" },
  { name: "Limiting Reactants", course: "CHEM 151", mastery: 51, last: "4 days ago", next: "Tomorrow", status: "Needs review" },
  { name: "Derivative Rules", course: "MATH 122A", mastery: 74, last: "2 days ago", next: "In 3 days", status: "Strong" },
  { name: "Thesis Statements", course: "ENGL 102", mastery: 81, last: "Last week", next: "In 5 days", status: "Strong" },
];

const assignments = [
  { title: "CHEM 151 Problem Set", due: "Tomorrow", difficulty: "Medium", time: "75 min", priority: "Urgent", tag: "urgent" },
  { title: "BIO 181 Exam", due: "In 4 days", difficulty: "High", time: "4 hrs prep", priority: "High impact", tag: "exam" },
  { title: "ENGL 102 Essay Outline", due: "Friday", difficulty: "Low", time: "45 min", priority: "Quick win", tag: "quick" },
  { title: "MATH 122A Quiz", due: "Next Monday", difficulty: "Medium", time: "90 min", priority: "Upcoming", tag: "upcoming" },
];

const smartTasks = [
  { title: "Review Cellular Respiration", detail: "BIO 181 exam in 4 days", priority: "High priority" },
  { title: "Work on CHEM problem set", detail: "Due tomorrow", priority: "Urgent" },
  { title: "Draft ENGL outline", detail: "Due Friday", priority: "Quick win" },
];

const notes = ["BIO 181 Lecture 7 Notes", "CHEM 151 Problem Set Review", "MATH 122A Derivative Rules"];

const tagStyles: Record<string, string> = {
  urgent: "bg-destructive/10 text-destructive border-destructive/20",
  exam: "bg-primary/10 text-primary border-primary/20",
  quick: "bg-success/10 text-success border-success/20",
  upcoming: "bg-accent/10 text-accent border-accent/20",
};

function WildcatRecallLogo() {
  return (
    <img 
      src="nerdy-wildcat-logo-plain.svg" 
      alt="Wildcat Recall Logo" 
      className="h-8 w-8" // You can still control the size here
    />
  );
}

function Shell({ demoMode = true }: { demoMode?: boolean }) {
  return (
    <header className="sticky top-0 z-20 border-b-2 border-primary/15 bg-background/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link to="/demo" className="flex items-center gap-3 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-hero text-primary-foreground shadow-glow ring-2 ring-primary/10">
            <WildcatRecallLogo />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-foreground">Wildcat Recall</p>
            <p className="text-xs font-medium text-muted-foreground">Adaptive review for Arizona students</p>
          </div>
        </Link>
        <nav className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
          {demoMode &&
            navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="shrink-0 border border-transparent px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-muted-foreground transition-all hover:border-primary/20 hover:bg-card hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          {demoMode && (
            <Link to="/" className="shrink-0 border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-destructive transition-all hover:bg-destructive hover:text-destructive-foreground">
              Exit demo
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function HeroCard() {
  return (
    <Card className="overflow-hidden border-0 bg-hero text-primary-foreground shadow-strong">
      <CardContent className="relative p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <Badge className="mb-4 border-primary-foreground/25 bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/15">
              <Sparkles className="mr-1 h-3.5 w-3.5" /> Recommended next step
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Good afternoon, Maya</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-primary-foreground/80">
              You’re on a 5-day review streak. Today’s plan is short, focused, and built around what matters most before your BIO 181 exam.
            </p>
          </div>
          <Link to="/demo/ai-review" className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-card px-5 text-sm font-medium text-card-foreground transition-colors hover:bg-card/90">
            Start Review <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCard({ icon: Icon, label, value, note }: { icon: typeof Zap; label: string; value: string; note: string }) {
  return (
    <Card className="border-border/70 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-strong">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs font-medium text-success">{note}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  return (
    <div className="space-y-4">
      <Card className="briefing-panel rounded-md">
        <CardContent className="relative p-4 sm:p-5">
          <div className="absolute right-4 top-4 hidden text-[10px] font-black uppercase tracking-[0.2em] text-primary/25 sm:block">Spring 2026 / Daily Brief</div>
          <div className="relative grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="stamp-label mb-3"><Sparkles className="mr-1 h-3.5 w-3.5" /> Today for Maya</div>
              <h1 className="max-w-3xl text-2xl font-black tracking-tight text-foreground sm:text-3xl">Good afternoon — 3 priorities need attention.</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                BIO 181 is the highest-impact review today. Your CHEM set is due tomorrow, and the ENGL outline is the quick win.
              </p>
            </div>
            <Link to="/demo/ai-review" className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-primary px-5 text-sm font-black text-primary-foreground transition-colors hover:bg-primary/90">
              Start Review <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-4">
        <CompactMetric icon={Zap} label="Streak" value="5 days" />
        <CompactMetric icon={CheckCircle2} label="Reviews" value="4 this week" />
        <CompactMetric icon={Medal} label="Done" value="2 assignments" />
        <CompactMetric icon={Target} label="Focus" value="BIO 181" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <Card className="notebook-panel rounded-md">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="micro-label">Adaptive order</p>
                <CardTitle className="text-lg font-black">Recall Queue</CardTitle>
              </div>
              <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10">Live plan</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-2">
            {smartTasks.map((task, index) => (
              <div key={task.title} className="priority-rail grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-sm p-2.5 pl-4 transition-colors hover:bg-muted/60">
                <div className="flex h-7 w-7 items-center justify-center border border-primary/25 solid-tint-primary font-mono text-xs font-black text-primary">0{index + 1}</div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.detail}</p>
                </div>
                <Badge variant="outline" className="h-fit text-[10px]">{task.priority}</Badge>
              </div>
            ))}
            <Link to="/demo/weekly-plan" className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-sm bg-primary px-3 text-sm font-black text-primary-foreground transition-colors hover:bg-primary/90">
              Open Weekly Plan <ChevronRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="notebook-panel rounded-md">
          <CardHeader className="p-4 pb-2">
            <p className="micro-label">Tutor card</p>
            <CardTitle className="text-lg font-black">Today’s AI Review</CardTitle>
            <CardDescription>18 min · 7 questions · Cellular Respiration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-2">
            <div className="rounded-lg border border-primary/15 solid-tint-primary p-3 text-sm leading-5 text-foreground">
              Recommended because BIO 181 exam is in 4 days and mastery is below 50%.
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-sm solid-panel border border-border/70 p-3">
                <p className="text-xs font-semibold text-muted-foreground">Length</p>
                <p className="text-xl font-bold text-primary">18 min</p>
              </div>
              <div className="rounded-sm solid-panel border border-border/70 p-3">
                <p className="text-xs font-semibold text-muted-foreground">Target</p>
                <p className="text-xl font-bold text-success">42→49%</p>
              </div>
            </div>
            <Link to="/demo/ai-review" className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
              Open Review
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DashboardPreview title="Topic Mastery" description="Weak topics surfaced first." to="/demo/notes" icon={BookOpen}>
          {topics.slice(0, 3).map((topic) => (
            <div key={topic.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{topic.name}</span>
                <span className="font-bold text-primary">{topic.mastery}%</span>
              </div>
              <MasteryBar value={topic.mastery} />
            </div>
          ))}
        </DashboardPreview>
        <DashboardPreview title="This Week" description="Deadlines at a glance." to="/demo/weekly-plan" icon={CalendarDays}>
          {assignments.slice(0, 3).map((item) => (
            <div key={item.title} className="flex items-center justify-between gap-2 data-row rounded-sm text-xs">
              <span className="font-semibold text-foreground">{item.title}</span>
              <span className="shrink-0 text-muted-foreground">{item.due}</span>
            </div>
          ))}
        </DashboardPreview>
        <DashboardPreview title="Momentum" description="Encouragement and support." to="/demo/resources" icon={HeartHandshake}>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">You completed 3 focused sessions this week.</p>
            <p>BIO 181 mastery improved by 12%.</p>
            <p>Keep the streak alive with one short review.</p>
          </div>
        </DashboardPreview>
      </div>
    </div>
  );
}

function CompactMetric({ icon: Icon, label, value }: { icon: typeof Zap; label: string; value: string }) {
  return (
    <Card className="rounded-md border-primary/15 bg-card/90 shadow-none">
      <CardContent className="flex items-center gap-3 border-l-4 border-accent p-3">
        <div className="flex h-8 w-8 items-center justify-center border border-accent/25 bg-accent/10 text-accent">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="micro-label">{label}</p>
          <p className="truncate font-mono text-sm font-black text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardPreview({ title, description, to, icon: Icon, children }: { title: string; description: string; to: string; icon: typeof Zap; children: ReactNode }) {
  return (
    <Card className="notebook-panel rounded-md">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg font-black"><Icon className="h-4 w-4 text-primary" /> {title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Link to={to} className="text-xs font-bold text-primary hover:underline">Open</Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-2">{children}</CardContent>
    </Card>
  );
}

function MasteryBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}

function TopicPreview() {
  return (
    <Card className="notebook-panel rounded-md">
      <CardHeader>
        <CardTitle>Topic Mastery</CardTitle>
        <CardDescription>Adaptive scores based on recent review sessions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topics.slice(0, 4).map((topic) => (
          <div key={topic.name} className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-foreground">{topic.name}</span>
              <span className="font-bold text-primary">{topic.mastery}%</span>
            </div>
            <MasteryBar value={topic.mastery} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function WeekOverview() {
  return (
    <Card className="notebook-panel rounded-md">
      <CardHeader>
        <CardTitle>This Week</CardTitle>
        <CardDescription>Upcoming deadlines and study pressure points</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {assignments.map((item) => (
          <div key={item.title} className="rounded-sm border border-border/70 solid-panel p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="font-semibold text-foreground">{item.title}</p>
              <Badge variant="outline" className={tagStyles[item.tag]}>{item.priority}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Due {item.due} · {item.time}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ReviewScreen() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card className="notebook-panel rounded-md">
        <CardHeader className="border-b border-border/70">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-2xl">BIO 181 Daily Review</CardTitle>
              <CardDescription>18 minutes · 7 questions · Focus: Cellular Respiration, ATP, Electron Transport Chain</CardDescription>
            </div>
            <Badge className="w-fit bg-primary text-primary-foreground">Question 3 of 7</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          <div className="rounded-sm border border-border/70 solid-panel p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary"><MessageSquareText className="h-4 w-4" /> AI tutor asks</div>
            <p className="text-xl font-semibold leading-8 text-foreground">In your own words, why does the electron transport chain produce more ATP than glycolysis?</p>
          </div>
          <Textarea placeholder="Type Maya’s answer here…" className="solid-panel min-h-36 resize-none text-base" />
          <div className="rounded-sm border border-warning/30 solid-tint-warning p-4 text-sm leading-6 text-foreground">
            Hint: Think about where H+ ions collect and how ATP synthase uses that gradient.
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button>Submit Answer</Button>
            <Button variant="outline"><Lightbulb className="h-4 w-4" /> Show Hint</Button>
            <Button variant="ghost">Skip</Button>
          </div>
          <div className="space-y-4 rounded-sm border border-success/25 solid-tint-success p-5 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 h-5 w-5 text-success" />
              <div>
                <p className="font-semibold text-foreground">Good start — you correctly mentioned ATP, but you missed the role of the proton gradient.</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Try connecting electron movement to H+ buildup across the inner mitochondrial membrane.</p>
              </div>
            </div>
            <div className="rounded-sm border border-border/70 solid-panel p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">Cellular Respiration mastery: <span className="text-muted-foreground">42%</span> <span className="text-success">→ 49%</span></p>
              <MasteryBar value={49} />
            </div>
          </div>
        </CardContent>
      </Card>
      <aside className="space-y-6">
        <Card className="notebook-panel rounded-md">
          <CardHeader>
            <CardTitle className="text-lg">Session Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MasteryBar value={43} />
            <p className="text-sm text-muted-foreground">Question 3 of 7 · about 10 minutes left</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 solid-tint-primary shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Brain className="h-5 w-5 text-primary" /> Spaced repetition</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">We’ll bring this topic back tomorrow because it is still developing.</p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function WeeklyPlan() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="space-y-6">
      <Card className="notebook-panel rounded-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" /> Weekly Plan</CardTitle>
          <CardDescription>AI-ranked tasks based on due date, difficulty, mastery, and time available</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-7">
          {days.map((day, i) => (
            <div key={day} className={cn("min-h-28 rounded-sm border p-3", i === 1 || i === 4 ? "border-primary/25 solid-tint-primary" : "border-border/70 bg-card")}>
              <p className="font-semibold text-foreground">{day}</p>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">{i === 1 ? "CHEM set due" : i === 4 ? "ENGL outline" : i === 5 ? "BIO review" : "Study block"}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
        <Card className="notebook-panel rounded-md">
          <CardHeader>
            <CardTitle>AI Priority Queue</CardTitle>
            <CardDescription>Overwhelm becomes one ordered list.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignments.map((task, index) => (
              <div key={task.title} className="rounded-sm border border-border/70 solid-panel p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</div>
                    <div>
                      <p className="font-bold text-foreground">{task.title}</p>
                      <p className="text-sm text-muted-foreground">Due {task.due} · {task.time} · {task.difficulty} difficulty</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={tagStyles[task.tag]}>{task.priority}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Suggested next step: {index === 0 ? "Review stoichiometry examples, complete problems 1–5, check answers, then rework missed problems." : index === 1 ? "Use tonight’s 45-minute opening for high-impact exam review." : index === 2 ? "Draft the thesis and outline before adding evidence." : "Do a short derivative rules refresh."}</p>
              </div>
            ))}
            <Button className="w-full">Generate Today’s Study Block</Button>
          </CardContent>
        </Card>
        <WeekOverview />
      </div>
    </div>
  );
}

function NotesMastery() {
  const filtered = topics;
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-6">
        <Card className="notebook-panel rounded-md">
          <CardHeader>
            <CardTitle className="text-lg">Courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[{ code: "All", name: "All courses", accent: "bg-muted-foreground" }, ...courses].map((c) => (
              <div key={c.code} className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-muted">
                <span className={cn("h-2.5 w-2.5 rounded-full", c.accent)} /> {c.code}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-dashed shadow-soft">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <UploadCloud className="h-9 w-9 text-primary" />
            <p className="font-semibold text-foreground">Drop notes, slides, or assignment descriptions here</p>
            <p className="text-xs text-muted-foreground">Prototype interaction · seeded notes only</p>
          </CardContent>
        </Card>
      </aside>
      <main className="space-y-6">
        <Card className="border-primary/20 solid-tint-primary shadow-soft">
          <CardContent className="flex items-start gap-3 p-5">
            <Sparkles className="mt-1 h-5 w-5 text-primary" />
            <p className="text-sm font-semibold leading-6 text-foreground">Recommended next review: Cellular Respiration, because your exam is soon and mastery is below 50%.</p>
          </CardContent>
        </Card>
        <Card className="notebook-panel rounded-md">
          <CardHeader>
            <CardTitle>Imported Notes</CardTitle>
            <CardDescription>Sources powering the topic list</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {notes.map((note) => (
              <div key={note} className="rounded-sm border border-border/70 solid-panel p-4">
                <FileText className="mb-3 h-5 w-5 text-primary" />
                <p className="font-semibold text-foreground">{note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="notebook-panel rounded-md">
          <CardHeader>
            <CardTitle>Topic Mastery Database</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {filtered.map((topic) => (
              <div key={topic.name} className="rounded-sm border border-border/70 solid-panel p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-foreground">{topic.name}</p>
                    <p className="text-sm text-muted-foreground">{topic.course} · Last reviewed {topic.last}</p>
                  </div>
                  <Badge variant="outline">{topic.status}</Badge>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm border-4 border-primary/20 solid-tint-primary text-lg font-bold text-primary">{topic.mastery}%</div>
                  <div className="flex-1">
                    <MasteryBar value={topic.mastery} />
                    <p className="mt-2 text-xs text-muted-foreground">Next review: {topic.next}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function Resources() {
  const resources = ["Tutoring", "Office hours", "Academic advising", "Mental health and wellness support", "Study groups"];
  return (
    <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <Card className="bg-hero text-primary-foreground shadow-strong">
        <CardHeader>
          <CardTitle className="text-3xl">You’re building momentum.</CardTitle>
          <CardDescription className="text-primary-foreground/75">Small sessions count, especially during busy weeks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {["You studied 4 days this week.", "You improved BIO 181 mastery by 12%.", "You finished 2 assignments before the deadline."].map((line) => (
            <div key={line} className="flex items-center gap-3 rounded-sm bg-primary-foreground/10 p-4">
              <CheckCircle2 className="h-5 w-5" /> <span className="font-semibold">{line}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="notebook-panel rounded-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary" /> Student Support</CardTitle>
          <CardDescription>When studying alone is not the best next step.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {resources.map((resource) => (
            <div key={resource} className="rounded-sm border border-border/70 solid-panel p-4 transition-colors hover:bg-muted/60">
              <BookOpen className="mb-3 h-5 w-5 text-accent" />
              <p className="font-semibold text-foreground">{resource}</p>
              <p className="mt-1 text-sm text-muted-foreground">Find the right campus help for this week’s pressure point.</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

const Index = () => {
  const { signInWithGoogle, user } = useAuth();
  
  if (user) {
    return <Navigate to="/app" replace />;
  }

  const featureStrip = [
    { title: "Upload notes", detail: "Turn scattered class material into reviewable topics." },
    { title: "Rank the day", detail: "See what matters first by deadline, mastery, and effort." },
    { title: "Practice recall", detail: "Answer tutor prompts instead of passively rereading." },
    { title: "Track mastery", detail: "Watch weak topics move from shaky to exam-ready." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Shell demoMode={false} />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="briefing-panel rounded-md p-5 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <div className="stamp-label mb-4">Arizona student command center</div>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-foreground sm:text-6xl">Know what to study next.</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                Wildcat Recall turns notes, deadlines, and shaky topics into one daily review plan — built for students who are tired of guessing what matters.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link to="/demo" className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-primary px-5 text-sm font-black text-primary-foreground transition-colors hover:bg-primary/90">
                  Try demo <ArrowRight className="h-4 w-4" />
                </Link>
                <button type="button" onClick={signInWithGoogle} className="inline-flex h-11 items-center justify-center rounded-sm border border-primary/25 bg-card px-5 text-sm font-black text-primary transition-colors hover:bg-muted">
                  Login
                </button>
                <button type="button" onClick={signInWithGoogle} className="inline-flex h-11 items-center justify-center rounded-sm border border-destructive/30 bg-destructive/10 px-5 text-sm font-black text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground">
                  Sign up
                </button>
              </div>
            </div>
            <div className="notebook-panel rounded-md p-4">
              <p className="micro-label mb-3">Sample recall queue</p>
              {smartTasks.map((task, index) => (
                <div key={task.title} className="priority-rail mb-2 grid grid-cols-[auto_1fr] gap-3 rounded-sm p-3 pl-4">
                  <span className="font-mono text-xs font-black text-primary">0{index + 1}</span>
                  <div>
                    <p className="text-sm font-black text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-4">
          {featureStrip.map((feature) => (
            <div key={feature.title} className="notebook-panel rounded-md p-4">
              <p className="font-black text-foreground">{feature.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.detail}</p>
            </div>
          ))}
        </section>

        <section id="login" className="grid gap-4 lg:grid-cols-2">
          <div className="solid-panel rounded-md border border-border/70 p-5">
            <p className="micro-label">Login</p>
            <h2 className="mt-2 text-2xl font-black text-foreground">Returning student access</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Use Google to open your private study workspace with profile-backed account data.</p>
            <Button onClick={signInWithGoogle} className="mt-4 rounded-sm">Continue with Google</Button>
          </div>
          <div id="signup" className="solid-panel rounded-md border border-border/70 p-5">
            <p className="micro-label">Sign up</p>
            <h2 className="mt-2 text-2xl font-black text-foreground">Create your recall plan</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Your account stores profile details now and can later connect notes, mastery, preferences, and weekly availability.</p>
            <Button onClick={signInWithGoogle} variant="outline" className="mt-4 rounded-sm">Sign up with Google</Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export const DemoDashboardPage = () => (
  <PageFrame>
    <Dashboard />
  </PageFrame>
);

function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Shell />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

export const AiReviewPage = () => (
  <PageFrame>
    <ReviewScreen />
  </PageFrame>
);

export const WeeklyPlanPage = () => (
  <PageFrame>
    <WeeklyPlan />
  </PageFrame>
);

export const NotesPage = () => (
  <PageFrame>
    <NotesMastery />
  </PageFrame>
);

export const ResourcesPage = () => (
  <PageFrame>
    <Resources />
  </PageFrame>
);

export default Index;
