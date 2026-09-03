import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, _ as createFileRoute, b as useRouter, d as HeadContent, f as useRouterState, g as lazyRouteComponent, h as Outlet, m as createRouter, u as Scripts, v as createRootRoute, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { d as mergeEvents, r as belongsToStation } from "./github-k11way4X.mjs";
import { a as string, i as object, n as literal, o as union, r as number, t as array } from "../_libs/zod.mjs";
import { c as House, d as Ellipsis, i as ScrollText, l as FileText, n as TriangleAlert, o as Radar, r as Settings2, s as MessageSquare, t as Users } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BiTPZ2ht.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-danger",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 1.75
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm text-muted",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var directoryHandle = null;
var lastSeen = /* @__PURE__ */ new Map();
function hasFolder() {
	return directoryHandle != null;
}
function folderName() {
	return directoryHandle?.name ?? null;
}
async function pickFolder() {
	const picker = window.showDirectoryPicker;
	if (!picker) return null;
	directoryHandle = await picker({ mode: "read" });
	lastSeen.clear();
	return directoryHandle.name;
}
function clearFolder() {
	directoryHandle = null;
	lastSeen.clear();
}
async function walk(handle, prefix, depth, out) {
	if (out.length > 400 || depth > 4) return;
	const entries = handle.values();
	for await (const entry of entries) {
		if (out.length > 400) return;
		const path = prefix ? `${prefix}/${entry.name}` : entry.name;
		if (entry.kind === "file") {
			const file = await entry.getFile();
			out.push({
				path,
				modified: file.lastModified
			});
		} else if (entry.kind === "directory") await walk(entry, path, depth + 1, out);
	}
}
async function scanFolder(actorLogin) {
	if (!directoryHandle) return [];
	const walked = [];
	try {
		await walk(directoryHandle, directoryHandle.name, 0, walked);
	} catch {
		return [];
	}
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const events = [];
	const isFirst = lastSeen.size === 0;
	for (const item of walked) {
		const prior = lastSeen.get(item.path);
		lastSeen.set(item.path, item.modified);
		if (isFirst || prior === void 0) continue;
		if (item.modified === prior) continue;
		events.push({
			id: `home-${item.path}-${item.modified}`,
			at: now,
			kind: "modify",
			source: "home",
			actorLogin,
			files: [item.path],
			summary: `Modified ${item.path} on the attached folder`
		});
	}
	if (isFirst) events.push({
		id: `home-attach-${Date.now()}`,
		at: now,
		kind: "open",
		source: "home",
		actorLogin,
		files: walked.slice(0, 12).map((item) => item.path),
		summary: `Attached folder ${directoryHandle.name} · ${walked.length} files in view`
	});
	return events;
}
function canPickFolder() {
	return typeof window !== "undefined" && "showDirectoryPicker" in window;
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var Input = object({
	username: string().min(1).max(80),
	org: string().max(80).optional(),
	token: string().max(240).optional(),
	knownShas: array(string().max(64)).max(40).optional()
});
var pullStation = createServerFn({ method: "POST" }).validator(Input).handler(createSsrRpc("68232eaaed01028ef324fcfed5aee9291d9ff0f16bed9d7b9172f1b90559a398"));
var pullWire = createServerFn({ method: "POST" }).handler(createSsrRpc("bc137a2bfc1be320ba421634b6768d801045a86ac96c6c44e9187849cbb7299c"));
/** Public events observed on EverettNC's GitHub. Replaced as soon as a live pull lands. */
var SEED_EVENTS = [
	{
		id: "seed-cs-6788e8e",
		at: "2026-09-03T05:27:09Z",
		kind: "push",
		source: "github",
		actorLogin: "EverettNC",
		repo: "EverettNC/Christman-Sound",
		files: [
			"christman_sound/corti_receiver.py",
			"christman_sound/word_ear_receiver.py",
			"pyproject.toml"
		],
		summary: "Touched 3 files in EverettNC/Christman-Sound",
		url: "https://github.com/EverettNC/Christman-Sound/commit/6788e8e609a8f3232859143a797f9cdaca67e7e4",
		sha: "6788e8e609a8f3232859143a797f9cdaca67e7e4"
	},
	{
		id: "gh-14170933516",
		at: "2026-08-31T23:22:40Z",
		kind: "issue",
		source: "github",
		actorLogin: "EverettNC",
		repo: "The-ChristmanAI-Project/Harvest-Now-Decrypt-Later",
		files: [],
		summary: "Closed issue: Help wanted: constant-time Rust ML-KEM backend (PyO3) on The-ChristmanAI-Project/Harvest-Now-Decrypt-Later",
		url: "https://github.com/The-ChristmanAI-Project/Harvest-Now-Decrypt-Later/issues/4"
	},
	{
		id: "gh-19551977104",
		at: "2026-08-31T08:04:24Z",
		kind: "push",
		source: "github",
		actorLogin: "EverettNC",
		repo: "EverettNC/Harvest-Now-Decrypt-Later",
		files: [
			"CONTRIBUTING.md",
			".github/CODEOWNERS",
			"christman_crypto/__init__.py",
			"README.md"
		],
		summary: "Touched 4 files in EverettNC/Harvest-Now-Decrypt-Later",
		url: "https://github.com/EverettNC/Harvest-Now-Decrypt-Later",
		sha: "fb855f36beda1762b31ea7ff1061ebe21c29464f"
	},
	{
		id: "gh-19544262235",
		at: "2026-08-31T09:54:00Z",
		kind: "push",
		source: "github",
		actorLogin: "EverettNC",
		repo: "EverettNC/mcp-media-ingestor",
		files: [
			"main.py",
			"dashboard.html",
			"server.py",
			"EAR.py"
		],
		summary: "Touched 4 files in EverettNC/mcp-media-ingestor",
		url: "https://github.com/EverettNC/mcp-media-ingestor",
		sha: "ccbf92a970e9350e234cfc25cb8a665083af1c38"
	}
];
var TOKEN_KEY = "honesty.github-token";
function readToken() {
	if (typeof window === "undefined") return "";
	return window.localStorage.getItem(TOKEN_KEY) ?? "";
}
function writeToken(token) {
	if (typeof window === "undefined") return;
	if (token.trim()) window.localStorage.setItem(TOKEN_KEY, token.trim());
	else window.localStorage.removeItem(TOKEN_KEY);
}
var defaultSettings = {
	stationName: "Home Station",
	githubUser: "EverettNC",
	githubOrg: "The-ChristmanAI-Project",
	pollSeconds: 180
};
var useStation = create()(persist((set) => ({
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
		{
			id: "ai-grok",
			name: "Grok",
			aliases: ["grok", "xai"]
		},
		{
			id: "ai-copilot",
			name: "Copilot",
			aliases: [
				"copilot",
				"copilot-swe-agent",
				"github-copilot"
			]
		},
		{
			id: "ai-claude",
			name: "Claude",
			aliases: ["claude", "anthropic"]
		}
	],
	knownActors: ["EverettNC"],
	watches: [{
		id: "watch-desk",
		path: "Home Station / desk",
		note: "Named seat of this watch. Not a kernel hook."
	}],
	events: SEED_EVENTS,
	reports: [],
	repos: [],
	setHydrated: () => set({ hydrated: true }),
	setArmed: (armed) => set({ armed }),
	setPulling: (pulling) => set({ pulling }),
	setSettings: (patch) => set((state) => ({ settings: {
		...state.settings,
		...patch
	} })),
	applyPull: ({ events, repos, warnings, fetchedAt, rateRemaining, ok }) => set((state) => {
		const scoped = events.filter((event) => belongsToStation(event, state.settings.githubUser, state.settings.githubOrg));
		return {
			events: mergeEvents(state.events, scoped).filter((event) => belongsToStation(event, state.settings.githubUser, state.settings.githubOrg)),
			repos,
			warnings,
			lastFetchedAt: fetchedAt,
			lastError: ok || scoped.length ? null : warnings[0] ?? "No record returned.",
			pulling: false,
			rateRemaining
		};
	}),
	addEvent: (event) => set((state) => ({ events: mergeEvents(state.events, [event]) })),
	addAi: (name, aliases) => set((state) => {
		const clean = name.trim();
		if (!clean) return state;
		if (state.namedAis.some((ai) => ai.name.toLowerCase() === clean.toLowerCase())) return state;
		const extra = (aliases ?? "").split(/[,;\s]+/).map((item) => item.trim()).filter(Boolean);
		return { namedAis: [...state.namedAis, {
			id: `ai-${Date.now().toString(36)}`,
			name: clean,
			aliases: extra.length ? extra : [clean]
		}] };
	}),
	removeAi: (id) => set((state) => ({ namedAis: state.namedAis.filter((ai) => ai.id !== id) })),
	addKnown: (login) => set((state) => {
		const clean = login.trim().replace(/^@/, "");
		if (!clean) return state;
		if (state.knownActors.some((name) => name.toLowerCase() === clean.toLowerCase())) return state;
		return { knownActors: [...state.knownActors, clean] };
	}),
	removeKnown: (login) => set((state) => ({ knownActors: state.knownActors.filter((name) => name.toLowerCase() !== login.toLowerCase()) })),
	addWatch: (path, note) => set((state) => ({ watches: [...state.watches, {
		id: `watch-${Date.now().toString(36)}`,
		path: path.trim(),
		note: note.trim()
	}] })),
	removeWatch: (id) => set((state) => ({ watches: state.watches.filter((watch) => watch.id !== id) })),
	addReport: (report) => set((state) => ({ reports: [report, ...state.reports].slice(0, 40) })),
	removeReport: (id) => set((state) => ({ reports: state.reports.filter((report) => report.id !== id) })),
	setFolderLabel: (folderLabel) => set({ folderLabel }),
	setPullingMail: (pullingMail) => set({ pullingMail }),
	applyMail: ({ events, warning, loginRequired, loginUrl, sources }) => set((state) => ({
		events: mergeEvents(state.events, events),
		mailWarning: warning,
		mailLoginRequired: loginRequired,
		mailLoginUrl: loginUrl ?? null,
		pullingMail: false,
		wireSources: sources ?? state.wireSources
	})),
	clearLedger: () => set({
		events: [],
		warnings: [],
		lastError: null
	})
}), {
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
		folderLabel: state.folderLabel
	})
}));
async function pullTheRecord() {
	const { settings, events, setPulling, applyPull } = useStation.getState();
	setPulling(true);
	try {
		const knownShas = events.map((event) => event.sha).filter((sha) => Boolean(sha)).slice(0, 40);
		const result = await pullStation({ data: {
			username: settings.githubUser,
			org: settings.githubOrg || void 0,
			token: readToken() || void 0,
			knownShas
		} });
		applyPull(result);
		return result;
	} catch (err) {
		const message = err instanceof Error ? err.message : "Pull failed.";
		applyPull({
			ok: false,
			events: [],
			repos: useStation.getState().repos,
			warnings: [message],
			fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
			rateRemaining: null
		});
		return null;
	}
}
async function pullTheWire(force = true) {
	const state = useStation.getState();
	if (!force && state.mailLoginRequired) return null;
	state.setPullingMail(true);
	try {
		const result = await pullWire();
		useStation.getState().applyMail(result);
		return result;
	} catch (err) {
		const message = err instanceof Error ? err.message : "Wire pull failed.";
		useStation.getState().applyMail({
			events: [],
			warning: message,
			loginRequired: false
		});
		return null;
	}
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var NAV = [
	{
		to: "/",
		label: "Desk",
		icon: House
	},
	{
		to: "/ledger",
		label: "Ledger",
		icon: FileText
	},
	{
		to: "/wire",
		label: "Wire",
		icon: MessageSquare
	},
	{
		to: "/systems",
		label: "AIs",
		icon: Radar
	},
	{
		to: "/people",
		label: "People",
		icon: Users
	},
	{
		to: "/reports",
		label: "Reports",
		icon: ScrollText
	},
	{
		to: "/station",
		label: "Station",
		icon: Settings2
	}
];
var MOBILE_PRIMARY = [
	"/",
	"/wire",
	"/ledger",
	"/systems"
];
var MOBILE_MORE = [
	"/people",
	"/reports",
	"/station"
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const armed = useStation((s) => s.armed);
	const hydrated = useStation((s) => s.hydrated);
	const pollSeconds = useStation((s) => s.settings.pollSeconds);
	const stationName = useStation((s) => s.settings.stationName);
	const actor = useStation((s) => s.settings.githubUser);
	const [moreOpen, setMoreOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const finish = () => {
			if (!cancelled) useStation.getState().setHydrated();
		};
		const result = useStation.persist.rehydrate();
		if (result) result.then(finish, finish);
		else finish();
		return () => {
			cancelled = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		pullTheRecord();
		if (useStation.getState().armed) pullTheWire(false);
	}, [hydrated]);
	(0, import_react.useEffect)(() => {
		if (!armed || !hydrated) return;
		const id = window.setInterval(() => {
			pullTheRecord();
			pullTheWire(false);
			if (canPickFolder() && hasFolder()) scanFolder(actor).then((events) => {
				for (const event of events) useStation.getState().addEvent(event);
			});
		}, Math.max(60, pollSeconds) * 1e3);
		return () => window.clearInterval(id);
	}, [
		armed,
		hydrated,
		pollSeconds,
		actor
	]);
	(0, import_react.useEffect)(() => {
		setMoreOpen(false);
	}, [pathname]);
	(0, import_react.useEffect)(() => {
		if (!moreOpen) return;
		const onKey = (event) => {
			if (event.key === "Escape") setMoreOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [moreOpen]);
	const moreActive = MOBILE_MORE.includes(pathname);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh overflow-x-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg",
				children: "Skip to record"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex min-h-dvh max-w-6xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-border px-4 py-6 md:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {
							armed,
							stationName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "mt-8 flex flex-col gap-1",
							"aria-label": "Station",
							children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
								...item,
								active: pathname === item.to
							}, item.to))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-auto pt-8 font-mono text-2xs leading-relaxed text-subtle",
							children: "Yours. Arm Honesty to scan for AI systems in the record and follow each one. Not a paywall. Not a kernel."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-1 flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex items-center justify-between gap-3 border-b border-border px-4 py-3 md:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {
							armed,
							stationName,
							compact: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-2xs text-muted",
							children: armed ? "ARMED" : "AT REST"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						id: "main",
						className: "min-w-0 flex-1 px-4 py-5 pb-24 md:px-8 md:py-8 md:pb-8",
						children
					})]
				})]
			}),
			moreOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 md:hidden",
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "More",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute inset-0 bg-bg/80",
					"aria-label": "Close menu",
					onClick: () => setMoreOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-border bg-surface px-4 pb-28 pt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker",
						children: "More"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-col gap-1",
						children: NAV.filter((item) => MOBILE_MORE.includes(item.to)).map((item) => {
							const Icon = item.icon;
							const active = pathname === item.to;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("flex min-h-11 items-center gap-3 rounded-md px-3 text-sm", active ? "bg-surface-2 text-fg" : "text-muted hover:bg-surface-2 hover:text-fg"),
								onClick: () => setMoreOpen(false),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-4",
									strokeWidth: 1.75
								}), item.label]
							}) }, item.to);
						})
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 pb-safe backdrop-blur-sm md:hidden",
				"aria-label": "Station",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "grid grid-cols-5",
					children: [MOBILE_PRIMARY.map((to) => {
						const item = NAV.find((entry) => entry.to === to);
						if (!item) return null;
						const Icon = item.icon;
						const active = pathname === item.to;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-2xs leading-none", active ? "text-fg" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-4 shrink-0",
								strokeWidth: 1.75
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
						}) }, item.to);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setMoreOpen((open) => !open),
						className: cn("flex min-h-14 w-full flex-col items-center justify-center gap-1 px-1 text-2xs leading-none", moreOpen || moreActive ? "text-fg" : "text-muted"),
						"aria-expanded": moreOpen,
						"aria-haspopup": "dialog",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, {
							className: "size-4 shrink-0",
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "More" })]
					}) })]
				})
			})
		]
	});
}
function Brand({ armed, stationName, compact }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("block rounded-full", armed ? "pulse-dot" : "size-2 bg-subtle"),
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-lg leading-none tracking-tight",
			children: "Honesty"
		}), !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-sm italic text-muted",
			children: "above all else"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 kicker",
			children: stationName
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-xs italic text-muted",
			children: "above all else"
		})] })]
	});
}
function NavLink({ to, label, icon: Icon, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: cn("flex min-h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-quick ease-out", active ? "bg-surface-2 text-fg" : "text-muted hover:bg-surface hover:text-fg"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "size-4",
			strokeWidth: 1.75
		}), label]
	});
}
var styles_default = "/assets/styles-MO6QTJjI.css";
var APP_NAME = "Honesty Above All Else";
var Route$7 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#0e0d0b"
			},
			{
				name: "description",
				content: "communications ledger for the home station — mail, calls, texts, meetings, GitHub — kept without spin. No paywall."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "bottom-right",
				toastOptions: { className: "font-sans bg-surface text-fg border border-border" }
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$6 = () => import("./routes-DyCq6BDY.mjs");
var Route$6 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./ledger-BVNcpBor.mjs");
var Route$5 = createFileRoute("/ledger")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./people-BeAjbNaG.mjs");
var Route$4 = createFileRoute("/people")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./reports-2NNz4PHn.mjs");
var Route$3 = createFileRoute("/reports")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./station-BeIf1uFQ.mjs");
var Route$2 = createFileRoute("/station")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./systems-BRAH9kJQ.mjs");
var Route$1 = createFileRoute("/systems")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./wire-DkGvt7Tv.mjs");
var Route = createFileRoute("/wire")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$6.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$7
	}),
	LedgerRoute: Route$5.update({
		id: "/ledger",
		path: "/ledger",
		getParentRoute: () => Route$7
	}),
	PeopleRoute: Route$4.update({
		id: "/people",
		path: "/people",
		getParentRoute: () => Route$7
	}),
	ReportsRoute: Route$3.update({
		id: "/reports",
		path: "/reports",
		getParentRoute: () => Route$7
	}),
	StationRoute: Route$2.update({
		id: "/station",
		path: "/station",
		getParentRoute: () => Route$7
	}),
	SystemsRoute: Route$1.update({
		id: "/systems",
		path: "/systems",
		getParentRoute: () => Route$7
	}),
	WireRoute: Route.update({
		id: "/wire",
		path: "/wire",
		getParentRoute: () => Route$7
	})
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { readToken as a, canPickFolder as c, pickFolder as d, scanFolder as f, pullTheWire as i, clearFolder as l, cn as n, useStation as o, pullTheRecord as r, writeToken as s, router_exports as t, folderName as u };
