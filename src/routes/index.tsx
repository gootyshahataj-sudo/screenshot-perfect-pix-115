import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, ScanLine, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSmartGuardAlerts } from "@/components/smartguard/alerts";
import { RiskBadge } from "@/components/smartguard/risk";
import { useHistory, useSettings } from "@/hooks/use-smartguard";
import { timeAgo } from "@/lib/smartguard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartGuard — Protection that notices threats before you do" },
      {
        name: "description",
        content:
          "SmartGuard turns unknown calls and suspicious content into clear, explainable safety signals with risk, confidence and evidence.",
      },
      { property: "og:title", content: "SmartGuard — Always-on phone safety assistant" },
      {
        property: "og:description",
        content:
          "Automatic, explainable alerts for suspicious calls and risky content. A frontend prototype.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { simulateCall, simulateScreen } = useSmartGuardAlerts();
  const { settings, update } = useSettings();
  const { items } = useHistory();

  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-3xl leading-tight font-bold sm:text-4xl">
          Protection that notices threats before you do.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          SmartGuard turns unknown calls and suspicious content into clear, explainable safety
          signals.
        </p>
      </section>

      <section className="surface-gradient rounded-3xl border border-border p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="shield-gradient flex size-11 items-center justify-center rounded-2xl">
              <ShieldCheck className="size-6 text-primary-foreground" />
            </span>
            <div>
              <p className="text-[11px] font-semibold tracking-widest text-primary-glow uppercase">
                Live protection
              </p>
              <p className="text-lg font-bold">
                {settings.liveProtection ? "SmartGuard is active" : "SmartGuard is paused"}
              </p>
              <p className="text-sm text-muted-foreground">
                {settings.liveProtection
                  ? "Protection is active in the background. Watching for supported safety signals."
                  : "Protection is paused. No signals are being checked."}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs font-medium">
                <span
                  className={
                    settings.liveProtection
                      ? "size-2 animate-pulse rounded-full bg-safe"
                      : "size-2 rounded-full bg-muted-foreground"
                  }
                />
                Protection {settings.liveProtection ? "ON" : "OFF"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/40 px-4 py-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Live Protection</p>
              <p className="text-sm font-semibold">{settings.liveProtection ? "ON" : "OFF"}</p>
            </div>
            <Switch
              checked={settings.liveProtection}
              onCheckedChange={(v) => update("liveProtection", v)}
              aria-label="Toggle live protection"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-end gap-6 border-t border-border pt-5">
          <div>
            <p className="font-display text-5xl leading-none font-bold text-safe">94</p>
            <p className="mt-1 text-sm font-semibold">Safety Score</p>
            <p className="text-xs text-muted-foreground">Based on recent detection signals</p>
          </div>
          <div className="min-w-[180px] flex-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[94%] rounded-full bg-safe transition-all duration-700" />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-primary/30 bg-primary/5 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary-glow" />
          <h2 className="text-base font-bold">Experience Automatic Protection</h2>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">
          SmartGuard is designed to alert you when something suspicious happens — without requiring
          you to open the app. These buttons simulate that experience.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button variant="hero" size="lg" className="flex-1" onClick={simulateCall}>
            <Phone className="size-4" /> Simulate Incoming Call
          </Button>
          <Button variant="outline" size="lg" className="flex-1" onClick={simulateScreen}>
            <ScanLine className="size-4" /> Simulate Suspicious Content
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <FeatureCard
          icon={<Phone className="size-5 text-primary-glow" />}
          eyebrow="Call Intelligence"
          title="Unknown calls"
          body="Identify suspicious callers using multiple signals."
          action={
            <Button variant="hero" className="w-full" onClick={simulateCall}>
              Try Call Demo
            </Button>
          }
          link="/calls"
        />
        <FeatureCard
          icon={<ScanLine className="size-5 text-primary-glow" />}
          eyebrow="Screen Intelligence"
          title="Suspicious content"
          body="Understand risky links, payment requests and phishing signals."
          action={
            <Button variant="hero" className="w-full" onClick={simulateScreen}>
              Try Screen Demo
            </Button>
          }
          link="/scan"
        />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold">Recent alerts</h2>
          <Link to="/history" className="text-sm font-medium text-primary-glow hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-2.5">
          {items.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-elevated">
                {item.kind === "call" ? (
                  <Phone className="size-4 text-muted-foreground" />
                ) : (
                  <ScanLine className="size-4 text-muted-foreground" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.subtitle} · {item.confidence}% confidence · {timeAgo(item.at)}
                </p>
              </div>
              <RiskBadge level={item.risk} className="hidden sm:inline-flex" />
            </div>
          ))}
          {items.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No alerts yet. Run a demo above to see how SmartGuard warns you.
            </p>
          )}
        </div>
      </section>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Prototype note: all detections here are simulated demonstrations of the intended product
        experience. A website cannot monitor real calls or private messages in the background.
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  eyebrow,
  title,
  body,
  action,
  link,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  action: React.ReactNode;
  link: string;
}) {
  return (
    <div className="flex flex-col rounded-3xl border border-border bg-card p-5 shadow-soft transition-transform duration-300 hover:-translate-y-0.5 hover:border-primary/40">
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-xl bg-elevated">
          {icon}
        </span>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
          {eyebrow}
        </p>
      </div>
      <p className="mt-3 text-lg font-bold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      <div className="mt-4 space-y-2">
        {action}
        <Link
          to={link}
          className="block text-center text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          Open full screen
        </Link>
      </div>
    </div>
  );
}
