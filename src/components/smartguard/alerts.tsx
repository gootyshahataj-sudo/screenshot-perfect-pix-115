import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Phone, PhoneOff, Shield, ShieldAlert, ScanLine, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ConfidenceBar, EvidenceItem, RiskBadge } from "@/components/smartguard/risk";
import { addDetection, loadSettings } from "@/lib/smartguard";

type AlertContextValue = {
  simulateCall: () => void;
  simulateScreen: () => void;
  openCallWhy: () => void;
  openScreenWhy: () => void;
};

const AlertContext = createContext<AlertContextValue | null>(null);

export function useSmartGuardAlerts() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useSmartGuardAlerts must be used inside SmartGuardAlertProvider");
  return ctx;
}

const CALLER = {
  number: "+91 98765 43210",
  label: "Potential Spam",
  hint: "Likely business caller",
  confidence: 91,
  reports: 387,
} as const;

export function SmartGuardAlertProvider({ children }: { children: ReactNode }) {
  const [callOpen, setCallOpen] = useState(false);
  const [callWhy, setCallWhy] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportChoice, setReportChoice] = useState("business");
  const [screenOpen, setScreenOpen] = useState(false);
  const [screenWhy, setScreenWhy] = useState(false);

  const simulateCall = useCallback(() => {
    const settings = loadSettings();
    if (!settings.liveProtection || !settings.callerIntelligence) {
      toast("Call Intelligence is paused", {
        description: "Turn it on in Privacy & Control to see automatic call alerts.",
      });
      return;
    }
    setCallOpen(true);
    if (settings.localHistory) {
      addDetection({
        kind: "call",
        title: CALLER.label,
        subtitle: CALLER.number,
        confidence: CALLER.confidence,
        risk: "HIGH",
      });
    }
  }, []);

  const simulateScreen = useCallback(() => {
    const settings = loadSettings();
    if (!settings.liveProtection || !settings.screenIntelligence) {
      toast("Screen Intelligence is paused", {
        description: "Turn it on in Privacy & Control to see automatic content alerts.",
      });
      return;
    }
    setScreenOpen(true);
    if (settings.localHistory) {
      addDetection({
        kind: "screen",
        title: "Possible phishing",
        subtitle: "Payment request",
        confidence: 94,
        risk: "HIGH",
      });
    }
  }, []);

  const value = useMemo(
    () => ({
      simulateCall,
      simulateScreen,
      openCallWhy: () => {
        setCallOpen(false);
        setCallWhy(true);
      },
      openScreenWhy: () => {
        setScreenOpen(false);
        setScreenWhy(true);
      },
    }),
    [simulateCall, simulateScreen],
  );

  return (
    <AlertContext.Provider value={value}>
      {children}

      {/* Incoming call overlay */}
      {callOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-4 backdrop-blur-sm sm:items-center">
          <div className="animate-slide-up w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
            <div className="flex items-center gap-2 border-b border-border bg-elevated px-5 py-3">
              <Shield className="size-4 text-primary" />
              <span className="text-sm font-semibold">SmartGuard</span>
              <span className="ml-auto text-[11px] tracking-wide text-muted-foreground uppercase">
                Incoming call
              </span>
            </div>
            <div className="px-5 py-6 text-center">
              <div className="animate-pulse-ring mx-auto flex size-16 items-center justify-center rounded-full bg-danger/15 text-danger">
                <Phone className="size-7" />
              </div>
              <p className="mt-4 text-lg font-bold">{CALLER.label}</p>
              <p className="font-display text-2xl font-bold tracking-tight">{CALLER.number}</p>
              <p className="mt-1 text-sm text-muted-foreground">{CALLER.hint}</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <RiskBadge level="HIGH" pulse />
                <span className="text-xs text-muted-foreground">
                  {CALLER.reports} community reports
                </span>
              </div>
              <div className="mt-5">
                <ConfidenceBar value={CALLER.confidence} />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="danger" size="lg" onClick={() => setCallOpen(false)}>
                  <PhoneOff className="size-4" /> Decline
                </Button>
                <Button variant="safe" size="lg" onClick={() => setCallOpen(false)}>
                  <Phone className="size-4" /> Answer
                </Button>
              </div>
              <Button variant="ghost" className="mt-2 w-full" onClick={value.openCallWhy}>
                View why
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Screen warning overlay */}
      {screenOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/70 p-4 backdrop-blur-sm sm:items-center">
          <div className="animate-slide-down w-full max-w-sm overflow-hidden rounded-3xl border border-danger/40 bg-card shadow-elevated">
            <div className="flex items-center gap-2 border-b border-border bg-danger/10 px-5 py-3">
              <ShieldAlert className="size-4 text-danger" />
              <span className="text-sm font-semibold">SmartGuard Alert</span>
              <button
                className="ml-auto text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Dismiss alert"
                onClick={() => setScreenOpen(false)}
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="px-5 py-5">
              <p className="text-lg font-bold">Potentially dangerous content</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Suspicious payment request detected on screen.
              </p>
              <div className="mt-3">
                <RiskBadge level="HIGH" pulse />
              </div>
              <div className="mt-4">
                <ConfidenceBar value={94} />
              </div>
              <div className="mt-5 grid gap-2">
                <Button variant="hero" onClick={value.openScreenWhy}>
                  View why
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="safe"
                    onClick={() => {
                      setScreenOpen(false);
                      toast.success("Staying safe", {
                        description: "Content left unopened. Verify in the official app.",
                      });
                    }}
                  >
                    Stay safe
                  </Button>
                  <Button variant="outline" onClick={() => setScreenOpen(false)}>
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call: why we think this */}
      <Dialog open={callWhy} onOpenChange={setCallWhy}>
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Why we think this</DialogTitle>
            <DialogDescription>
              High confidence — verify before trusting. SmartGuard shows signals, not verdicts.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-2xl border border-border bg-elevated/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-3xl font-bold">{CALLER.confidence}%</p>
                <p className="text-xs text-muted-foreground">Confidence in this assessment</p>
              </div>
              <RiskBadge level="HIGH" />
            </div>
            <div className="mt-4">
              <ConfidenceBar value={CALLER.confidence} />
            </div>
          </div>
          <div className="grid gap-2.5">
            <EvidenceItem
              title="Community reports"
              body={`${CALLER.reports} users have reported this number.`}
            />
            <EvidenceItem
              title="Calling pattern"
              body="Frequent short calls are associated with this number."
            />
            <EvidenceItem
              title="Business signals"
              body="Number appears in business-related records."
            />
            <EvidenceItem
              tone="warn"
              title="Identity not guaranteed"
              body="SmartGuard cannot guarantee who is behind a phone number."
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <Button
              variant="outline"
              onClick={() => {
                setCallWhy(false);
                setReportOpen(true);
              }}
            >
              Report incorrect
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setCallWhy(false);
                toast.success("Number blocked", { description: `${CALLER.number} was blocked.` });
              }}
            >
              Block number
            </Button>
            <Button variant="hero" onClick={() => setCallWhy(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report incorrect */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Help improve SmartGuard</DialogTitle>
            <DialogDescription>How would you classify this number?</DialogDescription>
          </DialogHeader>
          <RadioGroup value={reportChoice} onValueChange={setReportChoice} className="gap-2">
            {["personal", "business", "delivery", "spam", "other"].map((option) => (
              <Label
                key={option}
                htmlFor={`report-${option}`}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-elevated/60 px-4 py-3 text-sm font-medium capitalize transition-colors hover:border-primary/50"
              >
                <RadioGroupItem value={option} id={`report-${option}`} />
                {option}
              </Label>
            ))}
          </RadioGroup>
          <Button
            variant="hero"
            onClick={() => {
              setReportOpen(false);
              toast.success("Thanks — your report was saved.");
            }}
          >
            Submit report
          </Button>
        </DialogContent>
      </Dialog>

      {/* Screen analysis result */}
      <Dialog open={screenWhy} onOpenChange={setScreenWhy}>
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Possible phishing attempt</DialogTitle>
            <DialogDescription>
              94% confidence — signals below explain the warning.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-2xl border border-danger/30 bg-danger/10 p-4">
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl font-bold text-danger">HIGH RISK</p>
              <RiskBadge level="HIGH" pulse />
            </div>
            <div className="mt-4">
              <ConfidenceBar value={94} />
            </div>
          </div>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Why?
          </p>
          <div className="grid gap-2.5">
            <EvidenceItem
              tone="warn"
              title="Urgent language"
              body="The message creates pressure by threatening account blocking."
            />
            <EvidenceItem
              tone="warn"
              title="Unexpected payment request"
              body="The screen asks the user to make a payment."
            />
            <EvidenceItem
              tone="warn"
              title="Suspicious domain"
              body="The website does not match the claimed bank."
            />
            <EvidenceItem
              tone="warn"
              title="Credential/payment pressure"
              body="This is a common phishing signal."
            />
          </div>
          <div className="rounded-2xl border border-safe/30 bg-safe/10 p-4">
            <p className="text-xs font-semibold tracking-wider text-safe uppercase">
              Recommended action
            </p>
            <ul className="mt-2 space-y-1 text-sm text-foreground">
              <li>Do not enter passwords, OTPs or payment details.</li>
              <li>Open the official banking app directly and verify.</li>
            </ul>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              variant="safe"
              onClick={() => {
                setScreenWhy(false);
                toast.success("Staying safe", { description: "Nothing was opened or shared." });
              }}
            >
              Stay safe
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setScreenWhy(false);
                setTimeout(simulateScreen, 350);
              }}
            >
              <ScanLine className="size-4" /> Scan again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AlertContext.Provider>
  );
}
