import { createFileRoute } from "@tanstack/react-router";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/hooks/use-smartguard";
import type { Settings } from "@/lib/smartguard";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Privacy & Control — SmartGuard" },
      {
        name: "description",
        content:
          "Control SmartGuard's live protection, call and screen intelligence, local history and community reports.",
      },
      { property: "og:title", content: "Privacy & Control — SmartGuard" },
      {
        property: "og:description",
        content: "You decide what SmartGuard watches and what it stores.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const OPTIONS: { key: keyof Settings; label: string; description: string }[] = [
  {
    key: "liveProtection",
    label: "Live protection",
    description: "Master switch for all automatic alerts.",
  },
  {
    key: "callerIntelligence",
    label: "Call Intelligence",
    description: "Warn about likely spam and fraud callers.",
  },
  {
    key: "screenIntelligence",
    label: "Screen Intelligence",
    description: "Flag phishing and suspicious payment requests.",
  },
  {
    key: "localHistory",
    label: "Save history on device",
    description: "Keep a local record of detections.",
  },
  {
    key: "communityReports",
    label: "Community reports",
    description: "Use anonymous reports to improve accuracy.",
  },
];

function SettingsPage() {
  const { settings, update } = useSettings();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Privacy &amp; Control</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          Nothing leaves your device in this prototype. You stay in control of every signal.
        </p>
      </header>

      <div className="grid gap-3">
        {OPTIONS.map((option) => (
          <div
            key={option.key}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
          >
            <div className="min-w-0 flex-1">
              <Label htmlFor={option.key} className="text-sm font-bold">
                {option.label}
              </Label>
              <p className="mt-0.5 text-sm text-muted-foreground">{option.description}</p>
            </div>
            <Switch
              id={option.key}
              checked={settings[option.key]}
              onCheckedChange={(checked) => update(option.key, checked)}
            />
          </div>
        ))}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        SmartGuard shows signals, not verdicts. Always verify important requests through official
        apps or numbers.
      </p>
    </div>
  );
}
