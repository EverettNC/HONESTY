import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as SOURCE_LABEL } from "./github-k11way4X.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as pullTheWire, n as cn, o as useStation, r as pullTheRecord } from "./router-BiTPZ2ht.mjs";
import { i as Panel, n as Button, o as relTime, r as PageHeader, t as Badge } from "./panel-DZwo9SyZ.mjs";
import { t as Input } from "./input-BsBdtsnN.mjs";
import { i as trailFor, t as deriveAiSystems } from "./ai-scan-DUuF9Ge1.mjs";
import { t as EventFeed } from "./event-feed-CBYJvW5a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/systems-BRAH9kJQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SystemsPage() {
	const armed = useStation((s) => s.armed);
	const events = useStation((s) => s.events);
	const namedAis = useStation((s) => s.namedAis);
	const settings = useStation((s) => s.settings);
	const known = useStation((s) => s.knownActors);
	const pulling = useStation((s) => s.pulling);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [aliases, setAliases] = (0, import_react.useState)("");
	const systems = (0, import_react.useMemo)(() => deriveAiSystems(events, namedAis, armed), [
		events,
		namedAis,
		armed
	]);
	const tracking = systems.filter((system) => system.tracking);
	const current = systems.find((system) => system.id === selected) ?? systems[0] ?? null;
	const trail = current ? trailFor(current, events) : [];
	async function scan() {
		await Promise.all([pullTheRecord(), pullTheWire(true)]);
		const next = deriveAiSystems(useStation.getState().events, useStation.getState().namedAis, useStation.getState().armed);
		toast(`Scan complete. ${next.length} AI system${next.length === 1 ? "" : "s"} in the record. ${useStation.getState().armed ? "Following each." : "Arm the watch to follow."}`);
	}
	function nameAi(e) {
		e.preventDefault();
		const clean = name.trim();
		if (!clean) return;
		useStation.getState().addAi(clean, aliases);
		setName("");
		setAliases("");
		toast(`${clean} named. ${armed ? "Tracker started." : "Arm the watch to follow it."}`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "AI systems",
				title: "Scan, then follow.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => void scan(),
						disabled: pulling,
						children: pulling ? "Scanning" : "Scan now"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: armed ? "sage" : "muted",
						children: armed ? `${tracking.length} tracking` : "At rest"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [systems.length, " systems"] })
				] }),
				children: "This desk cannot see other programs on the computer. Arm Honesty and it scans GitHub, mail, the wire, and every AI you name. A tracker opens on each one, and follows that name wherever it appears in the record."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: nameAi,
					className: "flex flex-col gap-3 sm:flex-row sm:items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block min-w-0 flex-1 text-sm",
							children: ["Name an AI", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-2",
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Grok, Copilot, a local model"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block min-w-0 flex-1 text-sm",
							children: ["Aliases", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-2",
								value: aliases,
								onChange: (e) => setAliases(e.target.value),
								placeholder: "optional logins, comma-separated"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Watch it"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid items-start gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl",
					children: "Trackers"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-2",
					children: [systems.map((system) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setSelected(system.id),
						className: cn("w-full rounded-md px-3 py-3 text-left", current?.id === system.id ? "bg-surface-2" : "hover:bg-surface-2"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-medium",
								children: system.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: system.tracking ? "sage" : "muted",
								children: system.tracking ? "following" : "at rest"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-mono text-xs text-subtle",
							children: [
								system.eventCount,
								" · ",
								system.origin,
								system.lastAt ? ` · ${relTime(system.lastAt)}` : " · not seen yet"
							]
						})]
					}) }, system.id)), systems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted",
						children: "Name an AI, or arm the watch to scan."
					}) : null]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					className: "lg:col-span-2",
					children: current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl",
								children: current.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: current.tracking ? "Tracker live. New GitHub, mail, and wire hits attach here." : "Named. Arm the watch to follow it through the record."
							})] }), namedAis.some((ai) => ai.id === current.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => {
									useStation.getState().removeAi(current.id);
									setSelected(null);
								},
								children: "Remove"
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-1",
							children: [current.places.slice(0, 8).map((place) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: SOURCE_LABEL[place] ?? place }, place)), current.files.slice(0, 4).map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "paper",
								children: file
							}, file))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventFeed, {
							events: trail,
							owner: settings.githubUser,
							known,
							empty: current.tracking ? "No movement yet. Following. When this AI appears on GitHub, mail, or the wire, the trail fills." : "No movement in the record. Arm the watch to follow."
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-10 text-sm text-muted",
						children: "No tracker selected."
					})
				})]
			})
		]
	});
}
//#endregion
export { SystemsPage as component };
