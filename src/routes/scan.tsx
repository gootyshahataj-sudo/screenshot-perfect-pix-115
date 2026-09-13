import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Link2, ScanLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSmartGuardAlerts } from "@/components/smartguard/alerts";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Screen Intelligence — SmartGuard" },
      {
        name: "description",
        content:
          "SmartGuard analyzes suspicious content and explains the warning signs behind phishing and payment scams.",
      },
      { property: "og:title", content: "Screen Intelligence — SmartGuard" },
      {
        property: "og:description",
        content: "Understand risky links, payment requests and phishing signals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Scan,
});

function Scan() {
  const { simulateScreen, openScreenWhy } = useSmartGuardAlerts();
  const [scanning, setScanning] = useState(false);

  const analyze = () => {
    setScanning(true);
    window.setTimeout(() => {
      setScanning(false);
      openScreenWhy();
    }, 1600);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Screen Intelligence</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          SmartGuard analyzes suspicious content and explains the warning signs.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-start">
        <div className="mx-auto w-full max-w-[320px]">
          <div className="relative overflow-hidden rounded-[2.25rem] border-4 border-elevated bg-background p-3 shadow-soft">
            <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-elevated" />
            <div className="relative overflow-hidden rounded-3xl bg-card p-4">
              {scanning && (
                <div className="animate-scan-line pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-primary/40 to-transparent" />
              )}
              <span className="inline-flex rounded-full bg-warn/15 px-2 py-0.5 text-[10px] font-bold tracking-widest text-warn uppercase">
                Demo content
              </span>
              <p className="mt-3 text-sm font-bold">SecureBank</p>
              <div className="mt-2 rounded-2xl bg-elevated p-3">
                <p className="flex items-start gap-2 text-sm font-semibold">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warn" />
                  Your account will be blocked today.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">Pay ₹9,999 to verify</p>
                <p className="mt-3 flex items-center gap-1.5 text-xs break-all text-primary-glow underline">
                  <Link2 className="size-3 shrink-0" />
                  secure-bank-login.example
                </p>
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Sample message used for this prototype only.
              </p>
            </div>
          </div>
          <Button
            variant="hero"
            size="lg"
            className="mt-4 w-full"
            onClick={analyze}
            disabled={scanning}
          >
            <ScanLine className="size-4" />
            {scanning ? "Analyzing screen…" : "Analyze Screen"}
          </Button>
        </div>

        <div className="space-y-4">
          <section className="rounded-3xl border border-primary/30 bg-primary/5 p-5">
            <h2 className="text-base font-bold">Automatic alert demo</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              In the real product, this warning would appear on its own — without opening
              SmartGuard. Try the simulation.
            </p>
            <Button variant="outline" size="lg" className="mt-4 w-full" onClick={simulateScreen}>
              Simulate Suspicious Screen
            </Button>
          </section>

          <section className="rounded-3xl border border-border bg-card p-5">
            <h2 className="text-base font-bold">What gets flagged</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>• Urgent language and deadline pressure</li>
              <li>• Unexpected payment or OTP requests</li>
              <li>• Domains that do not match the claimed brand</li>
              <li>• Credential harvesting patterns</li>
            </ul>
          </section>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Prototype note: nothing on your device is read. The content above is fixed demo data
            used to show the intended experience.
          </p>
        </div>
      </div>
    </div>
  );
}
