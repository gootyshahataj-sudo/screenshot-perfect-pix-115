import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/smartguard";

const riskStyles: Record<RiskLevel, string> = {
  HIGH: "bg-danger/15 text-danger border-danger/40",
  MEDIUM: "bg-warn/15 text-warn border-warn/40",
  LOW: "bg-safe/15 text-safe border-safe/40",
};

export function RiskBadge({
  level,
  className,
  pulse = false,
}: {
  level: RiskLevel;
  className?: string;
  pulse?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase",
        riskStyles[level],
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full bg-current",
          pulse && "animate-pulse",
        )}
      />
      {level === "HIGH" ? "High risk" : level === "MEDIUM" ? "Medium risk" : "Low risk"}
    </span>
  );
}

export function ConfidenceBar({
  value,
  level = "HIGH",
  label = "Confidence",
}: {
  value: number;
  level?: RiskLevel;
  label?: string;
}) {
  const color =
    level === "HIGH" ? "bg-danger" : level === "MEDIUM" ? "bg-warn" : "bg-safe";
  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-baseline justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-semibold text-foreground">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-[width] duration-700 ease-out", color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function EvidenceItem({
  tone = "check",
  title,
  body,
}: {
  tone?: "check" | "warn";
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-elevated/60 p-3.5 transition-colors hover:border-primary/40">
      <span
        className={cn(
          "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          tone === "check" ? "bg-safe/15 text-safe" : "bg-warn/15 text-warn",
        )}
      >
        {tone === "check" ? "✓" : "!"}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
