import { createFileRoute } from "@tanstack/react-router";
import { PhoneCall, ScanLine, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/smartguard/risk";
import { useHistory } from "@/hooks/use-smartguard";
import { timeAgo } from "@/lib/smartguard";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Detection History — SmartGuard" },
      {
        name: "description",
        content:
          "Review past SmartGuard call and screen detections, their risk level and confidence scores.",
      },
      { property: "og:title", content: "Detection History — SmartGuard" },
      {
        property: "og:description",
        content: "Every call and screen alert SmartGuard raised, stored on your device.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { items, clear } = useHistory();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Detection History</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Stored only on this device. Clear it any time.
          </p>
        </div>
        <Button variant="outline" onClick={clear} disabled={items.length === 0}>
          <Trash2 className="size-4" /> Clear history
        </Button>
      </header>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-10 text-center">
          <p className="text-base font-semibold">No detections yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Run a simulation from Calls or Scan to see entries here.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-elevated text-primary">
                {item.kind === "call" ? (
                  <PhoneCall className="size-5" />
                ) : (
                  <ScanLine className="size-5" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{item.title}</p>
                <p className="truncate text-sm text-muted-foreground">{item.subtitle}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(item.at)}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <RiskBadge level={item.risk} />
                <span className="text-xs text-muted-foreground">{item.confidence}%</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
