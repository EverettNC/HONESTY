import { create } from "zustand";
import { persist } from "zustand/middleware";
import { belongsToStation, mergeEvents } from "./github";
import { SEED_EVENTS } from "./seed";
import type {
  AccessEvent,
  HonestyReport,
  ManualWatch,
  NamedAi,
  StationSettings,
  WireSourceStatus,
} from "./types";

const TOKEN_KEY = "honesty.github-token";

export function readToken(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(TOKEN_KEY) ?? "";
}

export function writeToken(token: string) {
  if (typeof window === "undefined") return;
  if (token.trim()) window.localStorage.setItem(TOKEN_KEY, token.trim());
  else window.localStorage.removeItem(TOKEN_KEY);
}

export type StationState = {
  hydrated: boolean;
  armed: boolean;
  pulling: boolean;
  lastFetchedAt: string | null;
  lastError: string | null;
  warnings: string[];
  rateRemaining: number | null;
  folderLabel: string | null;
  mailWarning: string | null;
  mailLoginUrl: string | null;
  mailLoginRequired: boolean;
  pullingMail: boolean;
  wireSources: WireSourceStatus[];
  settings: StationSettings;
  namedAis: NamedAi[];
  knownActors: string[];
  watches: ManualWatch[];
  events: AccessEvent[];
  reports: HonestyReport[];
  repos: {
    full_name: string;
    html_url: string;
    private: boolean;
    pushed_at: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    description: string | null;
  }[];
  setHydrated: () => void;
  setArmed: (armed: boolean) => void;
  setPulling: (pulling: boolean) => void;
  setSettings: (patch: Partial<StationSettings>) => void;
  applyPull: (input: {
    events: AccessEvent[];
    repos: StationState["repos"];
    warnings: string[];
    fetchedAt: string;
    rateRemaining: number | null;
    ok: boolean;
  }) => void;
  addEvent: (event: AccessEvent) => void;
  addAi: (name: string, aliases?: string) => void;
  removeAi: (id: string) => void;
  addKnown: (login: string) => void;
  removeKnown: (login: string) => void;
  addWatch: (path: string, note: string) => void;
  removeWatch: (id: string) => void;
  addReport: (report: HonestyReport) => void;
  removeReport: (id: string) => void;
  setFolderLabel: (label: string | null) => void;
  applyMail: (input: {
    events: AccessEvent[];
    warning: string | null;
    loginRequired: boolean;
    loginUrl?: string;
    sources?: WireSourceStatus[];
  }) => void;
  setPullingMail: (pulling: boolean) => void;
  clearLedger: () => void;
};

const defaultSettings: StationSettings = {
  stationName: "Home Station",
  githubUser: "EverettNC",
  githubOrg: "The-ChristmanAI-Project",
  pollSeconds: 180,
};

export const useStation = create<StationState>()(
  persist(
    (set) => ({
      hydrated: false,
      armed: false,
      pulling: false,
      lastFetchedAt: null,
      lastError: null,
      warnings: [],
      rateRemaining: null,
      folderLabel: null,
      mailWarning: null,
      mailLoginUrl: null,
      mailLoginRequired: false,
      pullingMail: false,
      wireSources: [],
      settings: defaultSettings,
      namedAis: [
        { id: "ai-grok", name: "Grok", aliases: ["grok", "xai"] },
        { id: "ai-copilot", name: "Copilot", aliases: ["copilot", "copilot-swe-agent", "github-copilot"] },
        { id: "ai-claude", name: "Claude", aliases: ["claude", "anthropic"] },
      ],
      knownActors: ["EverettNC"],
      watches: [
        {
          id: "watch-desk",
          path: "Home Station / desk",
          note: "Named seat of this watch. Not a kernel hook.",
        },
      ],
      events: SEED_EVENTS,
      reports: [],
      repos: [],
      setHydrated: () => set({ hydrated: true }),
      setArmed: (armed) => set({ armed }),
      setPulling: (pulling) => set({ pulling }),
      setSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),
      applyPull: ({ events, repos, warnings, fetchedAt, rateRemaining, ok }) =>
        set((state) => {
          const scoped = events.filter((event) =>
            belongsToStation(event, state.settings.githubUser, state.settings.githubOrg),
          );
          const merged = mergeEvents(state.events, scoped).filter((event) =>
            belongsToStation(event, state.settings.githubUser, state.settings.githubOrg),
          );
          return {
            events: merged,
            repos,
            warnings,
            lastFetchedAt: fetchedAt,
            lastError: ok || scoped.length ? null : warnings[0] ?? "No record returned.",
            pulling: false,
            rateRemaining,
          };
        }),
      addEvent: (event) =>
        set((state) => ({ events: mergeEvents(state.events, [event]) })),
      addAi: (name, aliases) =>
        set((state) => {
          const clean = name.trim();
          if (!clean) return state;
          if (state.namedAis.some((ai) => ai.name.toLowerCase() === clean.toLowerCase())) {
            return state;
          }
          const extra = (aliases ?? "")
            .split(/[,;\s]+/)
            .map((item) => item.trim())
            .filter(Boolean);
          return {
            namedAis: [
              ...state.namedAis,
              {
                id: `ai-${Date.now().toString(36)}`,
                name: clean,
                aliases: extra.length ? extra : [clean],
              },
            ],
          };
        }),
      removeAi: (id) =>
        set((state) => ({ namedAis: state.namedAis.filter((ai) => ai.id !== id) })),
      addKnown: (login) =>
        set((state) => {
          const clean = login.trim().replace(/^@/, "");
          if (!clean) return state;
          if (state.knownActors.some((name) => name.toLowerCase() === clean.toLowerCase())) {
            return state;
          }
          return { knownActors: [...state.knownActors, clean] };
        }),
      removeKnown: (login) =>
        set((state) => ({
          knownActors: state.knownActors.filter(
            (name) => name.toLowerCase() !== login.toLowerCase(),
          ),
        })),
      addWatch: (path, note) =>
        set((state) => ({
          watches: [
            ...state.watches,
            {
              id: `watch-${Date.now().toString(36)}`,
              path: path.trim(),
              note: note.trim(),
            },
          ],
        })),
      removeWatch: (id) =>
        set((state) => ({ watches: state.watches.filter((watch) => watch.id !== id) })),
      addReport: (report) =>
        set((state) => ({ reports: [report, ...state.reports].slice(0, 40) })),
      removeReport: (id) =>
        set((state) => ({ reports: state.reports.filter((report) => report.id !== id) })),
      setFolderLabel: (folderLabel) => set({ folderLabel }),
      setPullingMail: (pullingMail) => set({ pullingMail }),
      applyMail: ({ events, warning, loginRequired, loginUrl, sources }) =>
        set((state) => ({
          events: mergeEvents(state.events, events),
          mailWarning: warning,
          mailLoginRequired: loginRequired,
          mailLoginUrl: loginUrl ?? null,
          pullingMail: false,
          wireSources: sources ?? state.wireSources,
        })),
      clearLedger: () => set({ events: [], warnings: [], lastError: null }),
    }),
    {
      name: "honesty-station",
      skipHydration: true,
      partialize: (state) => ({
        armed: state.armed,
        settings: state.settings,
        namedAis: state.namedAis,
        knownActors: state.knownActors,
        watches: state.watches,
        events: state.events,
        reports: state.reports,
        repos: state.repos,
        lastFetchedAt: state.lastFetchedAt,
        folderLabel: state.folderLabel,
      }),
    },
  ),
);
