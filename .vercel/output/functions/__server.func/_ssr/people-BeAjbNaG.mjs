import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as isTrustedActor, i as deriveActors, t as KIND_LABEL } from "./github-k11way4X.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as useStation } from "./router-BiTPZ2ht.mjs";
import { i as Panel, n as Button, o as relTime, r as PageHeader, t as Badge } from "./panel-DZwo9SyZ.mjs";
import { t as Input } from "./input-BsBdtsnN.mjs";
import { i as deriveThreads } from "./comms-DI-inHBo.mjs";
import { r as isAiLogin } from "./ai-scan-DUuF9Ge1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/people-BeAjbNaG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PeoplePage() {
	const events = useStation((s) => s.events);
	const actors = (0, import_react.useMemo)(() => deriveActors(events), [events]);
	const threads = (0, import_react.useMemo)(() => deriveThreads(events), [events]);
	const known = useStation((s) => s.knownActors);
	const namedAis = useStation((s) => s.namedAis);
	const owner = useStation((s) => s.settings.githubUser);
	const [name, setName] = (0, import_react.useState)("");
	const ranked = [...actors].sort((a, b) => {
		return (isTrustedActor(a.login, owner, known) ? 1 : 0) - (isTrustedActor(b.login, owner, known) ? 1 : 0) || b.eventCount - a.eventCount;
	});
	function addKnown(e) {
		e.preventDefault();
		const login = name.trim();
		if (!login) return;
		useStation.getState().addKnown(login);
		setName("");
		toast(`${login} marked known`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "People",
				title: "Who you spoke with.",
				children: "Mail, calls, texts, meetings, GitHub. The owner is known. Anyone else is outside until you name them. Outside means unnamed, not hostile. This list is yours."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: addKnown,
				className: "mt-6 flex max-w-lg flex-col gap-3 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "Name or login",
					"aria-label": "Known person"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Mark known"
				})]
			}),
			known.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 flex flex-wrap gap-2",
				children: known.map((login) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => useStation.getState().removeKnown(login),
					className: "min-h-11 rounded-sm border border-border bg-surface px-3 text-sm text-muted hover:text-fg",
					children: [login, " · remove"]
				}) }, login))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 grid gap-3 sm:grid-cols-2",
				children: ranked.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-muted",
					children: "No people in the record yet. Put a communication on the Wire."
				}) : ranked.map((actor) => {
					const trusted = isTrustedActor(actor.login, owner, known);
					const ai = isAiLogin(actor.login, namedAis);
					const thread = threads.find((item) => item.who.toLowerCase() === actor.login.toLowerCase());
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: actor.login
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 font-mono text-xs tabular-nums text-subtle",
								children: [
									actor.eventCount,
									" event",
									actor.eventCount === 1 ? "" : "s",
									thread ? ` · ${thread.count} on the wire` : "",
									actor.lastAt ? ` · ${relTime(actor.lastAt)}` : ""
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 flex-wrap justify-end gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: trusted ? "sage" : "danger",
									children: trusted ? "known" : "outside"
								}), ai ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "paper",
									children: "AI"
								}) : null]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-1",
							children: actor.kinds.map((kind) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: KIND_LABEL[kind] }, kind))
						}),
						actor.files.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 truncate font-mono text-xs text-subtle",
							children: actor.files.slice(0, 3).join(" · ")
						}) : null,
						!trusted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4",
							size: "sm",
							variant: "secondary",
							onClick: () => useStation.getState().addKnown(actor.login),
							children: "Mark known"
						}) : null
					] }) }, actor.login);
				})
			})
		]
	});
}
//#endregion
export { PeoplePage as component };
