import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as isTrustedActor, n as SOURCE_LABEL, t as KIND_LABEL } from "./github-k11way4X.mjs";
import { u as ExternalLink } from "../_libs/lucide-react.mjs";
import { a as absTime, o as relTime, t as Badge } from "./panel-DZwo9SyZ.mjs";
import { t as DIRECTION_LABEL } from "./comms-DI-inHBo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/event-feed-CBYJvW5a.js
var import_jsx_runtime = require_jsx_runtime();
function EventFeed({ events, owner, known, empty, isAi }) {
	if (events.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-10 text-sm text-muted",
		children: empty
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "divide-y divide-border",
		children: events.map((event) => {
			const trusted = isTrustedActor(event.actorLogin, owner, known);
			const ai = isAi?.(event);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "py-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium text-fg",
										children: event.counterpart || event.actorLogin
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: trusted ? "sage" : "danger",
										children: trusted ? "known" : "outside"
									}),
									ai ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: "paper",
										children: "AI"
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: "paper",
										children: KIND_LABEL[event.kind]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: SOURCE_LABEL[event.source] }),
									event.direction ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: "muted",
										children: DIRECTION_LABEL[event.direction]
									}) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: event.summary
							}),
							event.files.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-2 space-y-1 font-mono text-xs text-subtle",
								children: [event.files.slice(0, 6).map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "truncate",
									children: file
								}, file)), event.files.length > 6 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"+",
									event.files.length - 6,
									" more"
								] }) : null]
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shrink-0 text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs tabular-nums text-muted",
							title: absTime(event.at),
							children: relTime(event.at)
						}), event.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: event.url,
							target: "_blank",
							rel: "noreferrer",
							className: "mt-2 inline-flex min-h-11 items-center gap-1 text-xs text-muted hover:text-fg",
							children: ["Open", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
								className: "size-3",
								strokeWidth: 1.75
							})]
						}) : null]
					})]
				})
			}, event.id);
		})
	});
}
//#endregion
export { EventFeed as t };
