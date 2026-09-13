import { useCallback, useEffect, useState } from "react";
import {
  HISTORY_EVENT,
  SETTINGS_EVENT,
  clearHistory,
  defaultSettings,
  loadHistory,
  loadSettings,
  saveSettings,
  seedHistory,
  type Detection,
  type Settings,
} from "@/lib/smartguard";

export function useHistory() {
  const [items, setItems] = useState<Detection[]>(seedHistory);

  useEffect(() => {
    const sync = () => setItems(loadHistory());
    sync();
    window.addEventListener(HISTORY_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(HISTORY_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { items, clear: useCallback(() => clearHistory(), []) };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const sync = () => setSettings(loadSettings());
    sync();
    window.addEventListener(SETTINGS_EVENT, sync);
    return () => window.removeEventListener(SETTINGS_EVENT, sync);
  }, []);

  const update = useCallback((key: keyof Settings, value: boolean) => {
    const next = { ...loadSettings(), [key]: value };
    saveSettings(next);
    setSettings(next);
  }, []);

  return { settings, update };
}
