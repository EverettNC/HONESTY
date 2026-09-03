import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as deriveFiles, c as isTrustedActor, i as deriveActors, n as SOURCE_LABEL, o as isComms, t as KIND_LABEL } from "./github-k11way4X.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as cn, o as useStation } from "./router-BiTPZ2ht.mjs";
import { n as format } from "../_libs/date-fns.mjs";
import { a as absTime, i as Panel, n as Button, r as PageHeader, t as Badge } from "./panel-DZwo9SyZ.mjs";
import { n as counterpartOf, r as deriveChannels } from "./comms-DI-inHBo.mjs";
import { t as deriveAiSystems } from "./ai-scan-DUuF9Ge1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-2NNz4PHn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function stamp(iso) {
	try {
		return format(new Date(iso), "d MMM yyyy HH:mm");
	} catch {
		return iso;
	}
}
function buildReport(events, settings, knownActors, namedAis = [], armed = false) {
	const createdAt = (/* @__PURE__ */ new Date()).toISOString();
	const actors = deriveActors(events);
	const files = deriveFiles(events);
	const owner = settings.githubUser;
	const comms = events.filter(isComms);
	const channels = deriveChannels(events);
	const outside = actors.filter((actor) => !isTrustedActor(actor.login, owner, knownActors));
	const systems = deriveAiSystems(events, namedAis, armed);
	const window = events.length === 0 ? "no events yet" : `${stamp(events[events.length - 1].at)} → ${stamp(events[0].at)}`;
	const lines = [
		"HONESTY ABOVE ALL ELSE",
		`${settings.stationName} record`,
		`Generated ${stamp(createdAt)}`,
		`Watch: ${settings.githubUser}${settings.githubOrg ? ` · ${settings.githubOrg}` : ""}`,
		`Window: ${window}`,
		"",
		"SUMMARY",
		`  Events: ${events.length}`,
		`  Communications: ${comms.length}`,
		`  Files / targets: ${files.length}`,
		`  Actors: ${actors.length}`,
		`  AI systems: ${systems.length}`,
		`  Outside actors: ${outside.length}`,
		"",
		"CHANNELS"
	];
	for (const channel of channels.filter((item) => item.key !== "all")) lines.push(`  ${channel.label}: ${channel.count}`);
	lines.push("", "AI SYSTEMS");
	if (systems.length === 0) lines.push("  None named or found. This desk cannot see other programs on the computer.");
	else for (const system of systems) lines.push(`  ${system.name} (${system.origin}${system.tracking ? ", tracking" : ", at rest"}) — ${system.eventCount} hits${system.lastAt ? ` · last ${stamp(system.lastAt)}` : ""}`);
	lines.push("", "OUTSIDE");
	if (outside.length === 0) lines.push("  None in this window. Owner and named people only.");
	else for (const actor of outside) lines.push(`  ${actor.login} — ${actor.eventCount} event${actor.eventCount === 1 ? "" : "s"}${actor.lastAt ? ` · last ${stamp(actor.lastAt)}` : ""}`);
	lines.push("", "ACTORS");
	for (const actor of actors) {
		const tag = isTrustedActor(actor.login, owner, knownActors) ? "known" : "outside";
		lines.push(`  ${actor.login} (${tag}) — ${actor.eventCount}`);
	}
	lines.push("", "COMMUNICATIONS");
	if (comms.length === 0) {
		lines.push("  None recorded. Mail, calendar, Outlook, and Teams load when seated through Grok.");
		lines.push("  Calls, texts, Signal, iMessage, and meetings this desk cannot hear are written by hand.");
	} else for (const event of comms.slice(0, 120)) {
		const who = counterpartOf(event);
		const tagged = isTrustedActor(event.actorLogin, owner, knownActors) ? who : `${who} [outside]`;
		const dir = event.direction ? ` ${event.direction}` : "";
		lines.push(`  ${stamp(event.at)}  ${tagged}  ${KIND_LABEL[event.kind]}${dir}  ${SOURCE_LABEL[event.source]}  ${event.summary}`);
	}
	lines.push("", "FILES");
	const fileSlice = files.slice(0, 80);
	if (fileSlice.length === 0) lines.push("  No file paths in this window. Pushes without a token often hide paths.");
	else for (const file of fileSlice) lines.push(`  ${file.path} — ${file.lastActor} — ${KIND_LABEL[file.lastKind].toLowerCase()} — ${stamp(file.lastAt)} ×${file.count}`);
	lines.push("", "LEDGER");
	for (const event of events.slice(0, 120)) {
		const who = isTrustedActor(event.actorLogin, owner, knownActors) ? event.actorLogin : `${event.actorLogin} [outside]`;
		const extra = event.files.length ? ` · ${event.files.slice(0, 3).join(", ")}` : "";
		lines.push(`  ${stamp(event.at)}  ${who}  ${KIND_LABEL[event.kind]}  ${event.summary}${extra}`);
	}
	lines.push("", "LIMITS");
	lines.push("  This desk tracks communication it can see, and communication you write.");
	lines.push("  Gmail, Calendar, Outlook, and Teams load only when seated through Grok.");
	lines.push("  Phone calls, SMS, iMessage, Signal, WhatsApp, and other apps are on the record only if you write them here.");
	lines.push("  GitHub is the public record this desk can see from a browser. Private GitHub needs a token kept in this browser.");
	lines.push("  Honesty follows AI systems that appear on GitHub, mail, the wire, and names you give it.");
	lines.push("  It cannot scan other programs on the computer, attach to a process, or follow a phone.");
	lines.push("");
	return {
		id: `rep-${Date.now().toString(36)}`,
		createdAt,
		title: `Honesty report · ${format(new Date(createdAt), "d MMM yyyy HH:mm")}`,
		body: lines.join("\n"),
		eventCount: events.length,
		fileCount: files.length,
		actorCount: actors.length,
		outsideCount: outside.length
	};
}
function ReportsPage() {
	const reports = useStation((s) => s.reports);
	const events = useStation((s) => s.events);
	const settings = useStation((s) => s.settings);
	const known = useStation((s) => s.knownActors);
	const namedAis = useStation((s) => s.namedAis);
	const armed = useStation((s) => s.armed);
	const [openId, setOpenId] = (0, import_react.useState)(reports[0]?.id ?? null);
	const open = reports.find((report) => report.id === openId) ?? reports[0] ?? null;
	function generate() {
		const report = buildReport(events, settings, known, namedAis, armed);
		useStation.getState().addReport(report);
		setOpenId(report.id);
		toast("Report kept.");
	}
	function download(body, title) {
		const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${title.replace(/[^\w.-]+/g, "-").toLowerCase()}.txt`;
		a.click();
		URL.revokeObjectURL(url);
	}
	async function copy(body) {
		try {
			await navigator.clipboard.writeText(body);
			toast("Copied the report.");
		} catch {
			toast("Could not copy.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Reports",
			title: "Kept, as written.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "lg",
				onClick: generate,
				disabled: events.length === 0,
				children: "Keep a report"
			}),
			children: "A snapshot of the ledger in this browser. Generate whenever you want a dated copy."
		}), reports.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-10 text-sm text-muted",
			children: "No reports yet. Pull the record, then keep one. Empty windows are not filed."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid items-start gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-2",
				children: reports.map((report) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setOpenId(report.id),
					className: cn("w-full rounded-md px-3 py-3 text-left", open?.id === report.id ? "bg-surface-2" : "hover:bg-surface"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: report.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-mono text-xs text-subtle",
						children: [
							report.eventCount,
							" events · ",
							report.outsideCount,
							" outside"
						]
					})]
				}) }, report.id))
			}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "lg:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "paper",
								children: absTime(open.createdAt)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [open.actorCount, " people"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								tone: open.outsideCount ? "danger" : "sage",
								children: [open.outsideCount, " outside"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => void copy(open.body),
								children: "Copy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => download(open.body, open.title),
								children: "Download"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => {
									useStation.getState().removeReport(open.id);
									setOpenId(null);
								},
								children: "Discard"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "ledger-rule mt-5 max-h-lg overflow-auto whitespace-pre-wrap rounded-md bg-bg p-4 font-mono text-xs leading-8 text-muted",
						children: open.body
					})
				]
			}) : null]
		})]
	});
}
//#endregion
export { ReportsPage as component };
