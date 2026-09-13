import { createFileRoute } from "@tanstack/react-router";
import { Phone, ShieldCheck, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSmartGuardAlerts } from "@/components/smartguard/alerts";
import { ConfidenceBar, EvidenceItem, RiskBadge } from "@/components/smartguard/risk";

export const Route = createFileRoute("/calls")({
  head: () => ({
    meta: [
      { title: "Call Intelligence — SmartGuard" },
      {
        name: "description",
        content:
          "See how SmartGuard flags unknown callers with risk level, confidence and the evidence behind every alert.",
      },
      { property: "og:title", content: "Call Intelligence — SmartGuard" },
      {
        property: "og:description",
        content: "Explainable alerts for unknown callers: risk, confidence and evidence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Calls,
});

function Calls() {
  const { simulateCall } = useSmartGuardAlerts();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Call Intelligence</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          SmartGuard checks supported signals for unknown numbers and explains what it found —
          never claiming certainty about who is calling.
        </p>
      </header>

      <section className="surface-gradient rounded-3xl border border-border p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="animate-pulse-ring flex size-12 items-center justify-center rounded-full bg-danger/15 text-danger">
              <Phone className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Potential Spam</p>
              <p className="font-display text-xl font-bold">+91 98765 43210</p>
              <p className="text-xs text-muted-foreground">Likely business caller</p>
            </div>
          </div>
          <RiskBadge level="HIGH" pulse />
        </div>
        <div className="mt-5 max-w-sm">
          <ConfidenceBar value={91} />
        </div>
        <Button variant="hero" size="lg" className="mt-5 w-full sm:w-auto" onClick={simulateCall}>
          Simulate Incoming Call
        </Button>
      </section>

      <section className="grid gap-2.5">
        <h2 className="text-base font-bold">What SmartGuard looks at</h2>
        <EvidenceItem title="Community reports" body="387 users have reported this number." />
        <EvidenceItem
          title="Calling pattern"
          body="Frequent short calls are associated with this number."
        />
        <EvidenceItem title="Business signals" body="Number appears in business-related records." />
        <EvidenceItem
          tone="warn"
          title="Identity not guaranteed"
          body="SmartGuard cannot guarantee who is behind a phone number."
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-5">
          <Users className="size-5 text-primary-glow" />
          <p className="mt-2 font-semibold">Community signal</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Reports from other people carry weight, but a single report never decides an outcome.
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5">
          <ShieldCheck className="size-5 text-primary-glow" />
          <p className="mt-2 font-semibold">Always explainable</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Every alert shows risk, confidence, evidence and a recommended action.
          </p>
        </div>
      </section>
    </div>
  );
}
