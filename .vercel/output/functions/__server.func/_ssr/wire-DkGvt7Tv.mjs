import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as redirectToLoginIfRequired } from "./login-C214iVwo.mjs";
import { o as isComms, t as KIND_LABEL } from "./github-k11way4X.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as pullTheWire, o as useStation } from "./router-BiTPZ2ht.mjs";
import { i as Panel, n as Button, o as relTime, r as PageHeader, t as Badge } from "./panel-DZwo9SyZ.mjs";
import { t as Chip } from "./chip-rAaaI8aM.mjs";
import { n as Textarea, t as Input } from "./input-BsBdtsnN.mjs";
import { i as deriveThreads, n as counterpartOf, r as deriveChannels, t as DIRECTION_LABEL } from "./comms-DI-inHBo.mjs";
import { t as EventFeed } from "./event-feed-CBYJvW5a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wire-DkGvt7Tv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CHANNELS = [
	{
		kind: "mail",
		label: "Mail",
		direction: "in"
	},
	{
		kind: "call",
		label: "Call",
		direction: "with"
	},
	{
		kind: "message",
		label: "Text",
		direction: "in"
	},
	{
		kind: "meeting",
		label: "Meeting",
		direction: "with"
	}
];
var FILTERS = [
	{
		key: "all",
		label: "All"
	},
	{
		key: "in",
		label: "In"
	},
	{
		key: "out",
		label: "Out"
	},
	{
		key: "mail",
		label: "Mail"
	},
	{
		key: "call",
		label: "Call"
	},
	{
		key: "message",
		label: "Text"
	},
	{
		key: "meeting",
		label: "Meeting"
	},
	{
		key: "github",
		label: "GitHub"
	},
	{
		key: "hand",
		label: "Recorded"
	}
];
function toLocalInput(iso) {
	const d = iso ? new Date(iso) : /* @__PURE__ */ new Date();
	if (Number.isNaN(d.getTime())) return "";
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function WirePage() {
	const events = useStation((s) => s.events);
	const settings = useStation((s) => s.settings);
	const known = useStation((s) => s.knownActors);
	const mailWarning = useStation((s) => s.mailWarning);
	const mailLoginRequired = useStation((s) => s.mailLoginRequired);
	const mailLoginUrl = useStation((s) => s.mailLoginUrl);
	const pullingMail = useStation((s) => s.pullingMail);
	const wireSources = useStation((s) => s.wireSources);
	const [kind, setKind] = (0, import_react.useState)("message");
	const [direction, setDirection] = (0, import_react.useState)("in");
	const [who, setWho] = (0, import_react.useState)("");
	const [summary, setSummary] = (0, import_react.useState)("");
	const [when, setWhen] = (0, import_react.useState)(toLocalInput());
	const [minutes, setMinutes] = (0, import_react.useState)("");
	const [query, setQuery] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [view, setView] = (0, import_react.useState)("traffic");
	const comms = (0, import_react.useMemo)(() => events.filter(isComms), [events]);
	const channels = (0, import_react.useMemo)(() => deriveChannels(events), [events]);
	const threads = (0, import_react.useMemo)(() => deriveThreads(events), [events]);
	const shown = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return comms.filter((event) => {
			if (filter === "in") {
				if (event.direction !== "in") return false;
			} else if (filter === "out") {
				if (event.direction !== "out") return false;
			} else if (filter === "mail") {
				if (event.kind !== "mail") return false;
			} else if (filter === "call") {
				if (event.kind !== "call") return false;
			} else if (filter === "message") {
				if (event.kind !== "message") return false;
			} else if (filter === "meeting") {
				if (event.kind !== "meeting") return false;
			} else if (filter === "github") {
				if (event.source !== "github") return false;
			} else if (filter === "hand") {
				if (event.source !== "wire") return false;
			}
			if (!q) return true;
			return event.actorLogin.toLowerCase().includes(q) || counterpartOf(event).toLowerCase().includes(q) || event.summary.toLowerCase().includes(q) || (event.subject ?? "").toLowerCase().includes(q);
		});
	}, [
		comms,
		filter,
		query
	]);
	function pickChannel(next) {
		setKind(next);
		const preset = CHANNELS.find((channel) => channel.kind === next);
		if (preset) setDirection(preset.direction);
	}
	function record(e) {
		e.preventDefault();
		const actor = (who.trim() || "You").replace(/^@/, "");
		const body = summary.trim();
		if (!body) {
			toast("Write what was said, or that a call happened.");
			return;
		}
		const label = CHANNELS.find((c) => c.kind === kind)?.label ?? "Text";
		const parsedWhen = when ? new Date(when) : /* @__PURE__ */ new Date();
		const at = Number.isNaN(parsedWhen.getTime()) ? (/* @__PURE__ */ new Date()).toISOString() : parsedWhen.toISOString();
		const duration = minutes.trim() ? ` (${minutes.trim()} min)` : "";
		const dirWord = DIRECTION_LABEL[direction].toLowerCase();
		useStation.getState().addEvent({
			id: `wire-${Date.now()}`,
			at,
			kind,
			source: "wire",
			actorLogin: actor,
			files: [],
			summary: `${label} ${dirWord} ${actor}${duration}: ${body}`,
			direction,
			counterpart: actor,
			subject: body.slice(0, 80)
		});
		setSummary("");
		setMinutes("");
		setWhen(toLocalInput());
		toast("On the wire. Yours.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "The wire",
				title: "All communication. Yours.",
				children: "No subscription. No lock. This desk keeps every channel it can see and every word you write. Mail, calendar, Outlook, and Teams load if they are already seated — optional. Calls, SMS, iMessage, Signal, WhatsApp: record them. A phone tap is not claimed."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: channels.filter((channel) => channel.key !== "github" && channel.key !== "hand").map((channel) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-surface px-4 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "kicker",
						children: channel.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-2 font-display text-2xl tabular-nums tracking-tight",
						children: channel.count
					})]
				}, channel.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => void pullTheWire(true),
						disabled: pullingMail,
						children: pullingMail ? "Pulling the wire" : "Pull the wire"
					}),
					mailLoginRequired && mailLoginUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => redirectToLoginIfRequired({
							ok: false,
							data: null,
							loginRequired: true,
							loginUrl: mailLoginUrl
						}),
						children: "Continue with Grok to load your data."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: comms.length ? "sage" : "muted",
						children: [comms.length, " on the wire"]
					})
				]
			}),
			mailWarning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: mailWarning
			}) : null,
			wireSources.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 flex flex-wrap gap-2",
				children: wireSources.map((source) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					tone: source.seated ? "sage" : "muted",
					children: [source.label, source.seated ? ` · ${source.count}` : " · optional"]
				}) }, source.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: record,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl",
							children: "Record a communication"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: CHANNELS.map((channel) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								active: kind === channel.kind,
								onClick: () => pickChannel(channel.kind),
								children: channel.label
							}, channel.kind))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: [
								"in",
								"out",
								"with"
							].map((dir) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								active: direction === dir,
								onClick: () => setDirection(dir),
								children: DIRECTION_LABEL[dir]
							}, dir))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: ["Who", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "mt-2",
									value: who,
									onChange: (e) => setWho(e.target.value),
									placeholder: "Name or address"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: ["When", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "mt-2",
									type: "datetime-local",
									value: when,
									onChange: (e) => setWhen(e.target.value)
								})]
							})]
						}),
						kind === "call" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block max-w-xs text-sm",
							children: ["Minutes", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-2",
								inputMode: "numeric",
								value: minutes,
								onChange: (e) => setMinutes(e.target.value),
								placeholder: "Optional"
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["What passed", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								className: "mt-2",
								value: summary,
								onChange: (e) => setSummary(e.target.value),
								placeholder: "Subject, outcome, or the words themselves"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Put it on the wire"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl",
							children: view === "traffic" ? "Traffic" : "People on the wire"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								active: view === "traffic",
								onClick: () => setView("traffic"),
								children: "Traffic"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								active: view === "people",
								onClick: () => setView("people"),
								children: "People"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-4",
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search names, subjects, words",
						"aria-label": "Search the wire"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-1",
						children: FILTERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							active: filter === item.key,
							onClick: () => setFilter(item.key),
							children: item.label
						}, item.key))
					}),
					view === "traffic" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventFeed, {
						events: shown,
						owner: settings.githubUser,
						known,
						empty: "Nothing in this filter. Record what passed — this desk does not wait on a paywall."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 divide-y divide-border",
						children: threads.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "py-10 text-sm text-muted",
							children: "No people on the wire yet. Record a communication."
						}) : threads.map((thread) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-start justify-between gap-3 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: thread.who
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted",
										children: thread.lastSummary
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 flex flex-wrap gap-1",
										children: thread.kinds.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: KIND_LABEL[item] }, item))
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-xs tabular-nums text-muted",
								children: [
									thread.count,
									" · ",
									relTime(thread.lastAt)
								]
							})]
						}, thread.key))
					})
				]
			})
		]
	});
}
//#endregion
export { WirePage as component };
