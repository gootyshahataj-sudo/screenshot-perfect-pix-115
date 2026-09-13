import { Link, useRouterState } from "@tanstack/react-router";
import { History, Home, PhoneCall, ScanLine, Settings, Shield } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Overview", short: "Home", icon: Home },
  { to: "/calls", label: "Call Intelligence", short: "Calls", icon: PhoneCall },
  { to: "/scan", label: "Screen Scanner", short: "Scan", icon: ScanLine },
  { to: "/history", label: "History", short: "History", icon: History },
  { to: "/settings", label: "Settings", short: "Settings", icon: Settings },
] as const;

export function SmartGuardLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="shield-gradient flex size-9 items-center justify-center rounded-xl shadow-soft">
        <Shield className="size-5 text-primary-foreground" />
      </span>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-tight">SmartGuard</span>
      )}
    </div>
  );
}

export function DemoModeChip() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-primary-glow uppercase">
      <span className="size-1.5 animate-pulse rounded-full bg-primary-glow" />
      Demo mode
    </span>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <SmartGuardLogo />
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Protection that notices threats before you do.
        </p>
        <nav className="mt-8 flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
                )}
              >
                <Icon className={cn("size-4", active && "text-primary-glow")} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl border border-border bg-elevated/60 p-4">
          <DemoModeChip />
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Alerts here are simulated. A browser cannot read your real calls or private messages.
          </p>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <SmartGuardLogo />
        <DemoModeChip />
      </header>

      <main className="pb-24 lg:pb-10 lg:pl-64">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {nav.map(({ to, short, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  active ? "text-primary-glow" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
                {short}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
