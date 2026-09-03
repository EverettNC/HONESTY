import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as deriveFiles, c as isTrustedActor, i as deriveActors, o as isComms } from "./github-k11way4X.mjs";
import { a as RefreshCw } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as pullTheWire, n as cn, o as useStation, r as pullTheRecord } from "./router-BiTPZ2ht.mjs";
import { i as Panel, n as Button, o as relTime, r as PageHeader, t as Badge } from "./panel-DZwo9SyZ.mjs";
import { t as Chip } from "./chip-rAaaI8aM.mjs";
import { i as deriveThreads, r as deriveChannels } from "./comms-DI-inHBo.mjs";
import { n as eventTouchesAnyAi, t as deriveAiSystems } from "./ai-scan-DUuF9Ge1.mjs";
import { t as EventFeed } from "./event-feed-CBYJvW5a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DyCq6BDY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Desk() {
	const armed = useStation((s) => s.armed);
	const pulling = useStation((s) => s.pulling);
	const events = useStation((s) => s.events);
	const settings = useStation((s) => s.settings);
	const known = useStation((s) => s.knownActors);
	const lastFetchedAt = useStation((s) => s.lastFetchedAt);
	const warnings = useStation((s) => s.warnings);
	const mailWarning = useStation((s) => s.mailWarning);
	const namedAis = useStation((s) => s.namedAis);
	const files = (0, import_react.useMemo)(() => deriveFiles(events), [events]);
	const actors = (0, import_react.useMemo)(() => deriveActors(events), [events]);
	const comms = (0, import_react.useMemo)(() => events.filter(isComms), [events]);
	const channels = (0, import_react.useMemo)(() => deriveChannels(events), [events]);
	const threads = (0, import_react.useMemo)(() => deriveThreads(events), [events]);
	const systems = (0, import_react.useMemo)(() => deriveAiSystems(events, namedAis, armed), [
		events,
		namedAis,
		armed
	]);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const voiceCount = (channels.find((c) => c.key === "call")?.count ?? 0) + (channels.find((c) => c.key === "meeting")?.count ?? 0);
	const outside = actors.filter((actor) => !isTrustedActor(actor.login, settings.githubUser, known));
	const shown = (0, import_react.useMemo)(() => {
		return events.filter((event) => {
			if (filter === "github") return event.source === "github";
			if (filter === "wire") return isComms(event);
			if (filter === "ai") return eventTouchesAnyAi(event, systems);
			if (filter === "outside") return !isTrustedActor(event.actorLogin, settings.githubUser, known);
			return true;
		});
	}, [
		events,
		filter,
		settings.githubUser,
		known,
		systems
	]);
	async function onArm() {
		const next = !armed;
		useStation.getState().setArmed(next);
		if (next) {
			toast("Watch armed. Scanning AI systems, then following each in the record.");
			await pullTheRecord();
			await pullTheWire();
			const found = deriveAiSystems(useStation.getState().events, useStation.getState().namedAis, true);
			toast(`Scan complete. ${found.length} AI system${found.length === 1 ? "" : "s"} on the watch. Following each.`);
		} else toast("Watch at rest. The ledger stays.");
	}
	async function onPull() {
		const [record, wire] = await Promise.all([pullTheRecord(), pullTheWire(true)]);
		const n = (record?.events.length ?? 0) + (wire?.events.length ?? 0);
		if (n > 0 || record?.ok) toast(`Record pulled · ${n} this pass`);
		else toast(record?.warnings[0] ?? "Pull returned no events. The ledger you wrote stays.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in mx-auto max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Home station desk",
				title: "The record, without spin.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					variant: armed ? "secondary" : "primary",
					onClick: () => void onArm(),
					children: armed ? "Stand down" : "Arm the watch"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "lg",
					variant: "ghost",
					onClick: () => void onPull(),
					disabled: pulling,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
						className: cn("size-4", pulling && "animate-spin"),
						strokeWidth: 1.75
					}), "Pull now"]
				})] }),
				children: "Yours. Arm Honesty and it scans GitHub, mail, the wire, and every AI you name — then starts a tracker on each one, and follows that name wherever it appears. This desk cannot see other programs on the computer. It is not a kernel hook, and it is not a paywall."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "On the wire",
						value: comms.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "AIs",
						value: systems.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Voice",
						value: voiceCount
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Outside",
						value: outside.length,
						alert: outside.length > 0
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-3 text-xs text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: armed ? "sage" : "muted",
						children: armed ? "Armed" : "At rest"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono tabular-nums",
						children: ["Last pull ", lastFetchedAt ? relTime(lastFetchedAt) : "not yet"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono",
						children: ["@", settings.githubUser]
					})
				]
			}),
			warnings[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-danger",
				children: warnings[0]
			}) : null,
			mailWarning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Mail is optional. Record by hand either way."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid items-start gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl",
							children: "Live ledger"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: [
								"all",
								"github",
								"wire",
								"ai",
								"outside"
							].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								active: filter === key,
								onClick: () => setFilter(key),
								children: key
							}, key))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventFeed, {
						events: shown.slice(0, 24),
						owner: settings.githubUser,
						known,
						isAi: (event) => eventTouchesAnyAi(event, systems),
						empty: "No events in this filter. Arm the watch or pull the record."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl",
								children: "AI systems"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-4 space-y-3",
								children: [systems.slice(0, 6).map((system) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-medium",
											children: system.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											tone: system.tracking ? "sage" : "muted",
											children: system.tracking ? "following" : "at rest"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-xs text-subtle",
										children: [
											system.eventCount,
											" hits",
											system.lastAt ? ` · ${relTime(system.lastAt)}` : " · not seen yet"
										]
									})]
								}, system.id)), systems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "text-sm text-muted",
									children: "Arm the watch to scan, or name an AI on Systems."
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/systems",
								className: "mt-4 inline-flex min-h-11 items-center text-sm text-muted hover:text-fg",
								children: "Open trackers"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl",
								children: "People on the wire"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-4 space-y-3",
								children: [threads.slice(0, 6).map((thread) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-medium",
										children: thread.who
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-xs text-subtle",
										children: [
											thread.count,
											" · ",
											relTime(thread.lastAt),
											" · ",
											thread.lastSummary
										]
									})]
								}, thread.key)), threads.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "text-sm text-muted",
									children: "No communication yet. Open the Wire and write it."
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap gap-x-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/people",
									className: "inline-flex min-h-11 items-center text-sm text-muted hover:text-fg",
									children: "Full list"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/wire",
									className: "inline-flex min-h-11 items-center text-sm text-muted hover:text-fg",
									children: "The wire"
								})]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl",
								children: "Latest files"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-4 space-y-2",
								children: [files.slice(0, 7).map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-mono text-xs text-fg",
										children: file.path
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-subtle",
										children: [
											file.lastActor,
											" · ",
											relTime(file.lastAt)
										]
									})]
								}, `${file.source}:${file.path}`)), files.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "text-sm text-muted",
									children: "No file paths yet."
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/ledger",
								className: "mt-4 inline-flex min-h-11 items-center text-sm text-muted hover:text-fg",
								children: "Open ledger"
							})
						] })
					]
				})]
			})
		]
	});
}
function Stat({ label, value, alert }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-surface px-4 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "kicker",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: cn("mt-2 font-display text-2xl tabular-nums tracking-tight", alert ? "text-danger" : "text-fg"),
			children: value
		})]
	});
}
//#endregion
export { Desk as component };
