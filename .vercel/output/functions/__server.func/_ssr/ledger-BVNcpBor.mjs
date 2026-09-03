import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as deriveFiles, c as isTrustedActor, t as KIND_LABEL } from "./github-k11way4X.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as useStation } from "./router-BiTPZ2ht.mjs";
import { a as absTime, i as Panel, n as Button, o as relTime, r as PageHeader, t as Badge } from "./panel-DZwo9SyZ.mjs";
import { t as Chip } from "./chip-rAaaI8aM.mjs";
import { t as Input } from "./input-BsBdtsnN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ledger-BVNcpBor.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LedgerPage() {
	const events = useStation((s) => s.events);
	const files = (0, import_react.useMemo)(() => deriveFiles(events), [events]);
	const settings = useStation((s) => s.settings);
	const known = useStation((s) => s.knownActors);
	const [query, setQuery] = (0, import_react.useState)("");
	const [path, setPath] = (0, import_react.useState)("");
	const [who, setWho] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("files");
	const q = query.trim().toLowerCase();
	const filteredFiles = (0, import_react.useMemo)(() => files.filter((file) => !q || file.path.toLowerCase().includes(q) || file.lastActor.toLowerCase().includes(q) || (file.repo ?? "").toLowerCase().includes(q)), [files, q]);
	const filteredEvents = (0, import_react.useMemo)(() => events.filter((event) => !q || event.actorLogin.toLowerCase().includes(q) || event.summary.toLowerCase().includes(q) || event.files.some((file) => file.toLowerCase().includes(q)) || (event.repo ?? "").toLowerCase().includes(q)), [events, q]);
	function recordOpen() {
		const filePath = path.trim();
		const actor = (who.trim() || "You").replace(/^@/, "");
		if (!filePath) {
			toast("Name the file that was opened.");
			return;
		}
		useStation.getState().addEvent({
			id: `home-open-${Date.now()}`,
			at: (/* @__PURE__ */ new Date()).toISOString(),
			kind: "open",
			source: "home",
			actorLogin: actor,
			files: [filePath],
			summary: `${actor} opened ${filePath} on ${settings.stationName}`
		});
		setPath("");
		toast("Opening recorded.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "File ledger",
				title: "What was opened, and by whom.",
				children: "GitHub pushes list files when GitHub sends them. Home openings you record here, or that the attached folder notices, sit in the same book."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						recordOpen();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Record a home opening"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-col gap-3 sm:flex-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: path,
								onChange: (e) => setPath(e.target.value),
								placeholder: "path/to/file",
								"aria-label": "File path"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "sm:max-w-40",
								value: who,
								onChange: (e) => setWho(e.target.value),
								placeholder: "Who",
								"aria-label": "Who opened it"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "Record"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Filter by file, person, or repo",
					"aria-label": "Filter ledger",
					className: "max-w-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: tab === "files",
						onClick: () => setTab("files"),
						children: "Files"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: tab === "events",
						onClick: () => setTab("events"),
						children: "Events"
					})]
				})]
			}),
			tab === "files" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-x-auto rounded-2xl border border-border bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-2xl text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-border text-xs uppercase tracking-wider text-subtle",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "File"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Last person"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Kind"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "When"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Times"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredFiles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 5,
						className: "px-4 py-10 text-muted",
						children: "No files match."
					}) }) : filteredFiles.map((file) => {
						const trusted = isTrustedActor(file.lastActor, settings.githubUser, known);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "max-w-md truncate font-mono text-xs",
										children: file.path
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-subtle",
										children: [file.source === "github" ? "GitHub" : "Home", file.repo ? ` · ${file.repo}` : ""]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mr-2",
										children: file.lastActor
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: trusted ? "sage" : "danger",
										children: trusted ? "known" : "outside"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted",
									children: KIND_LABEL[file.lastKind]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono text-xs tabular-nums text-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										title: absTime(file.lastAt),
										children: relTime(file.lastAt)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 tabular-nums",
									children: file.count
								})
							]
						}, `${file.source}:${file.path}`);
					}) })]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-x-auto rounded-2xl border border-border bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-2xl text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-border text-xs uppercase tracking-wider text-subtle",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "When"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Who"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "What"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Files"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredEvents.slice(0, 80).map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-mono text-xs tabular-nums text-muted",
								children: absTime(event.at)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: event.actorLogin
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted",
								children: event.summary
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-mono text-xs text-subtle",
								children: event.files.slice(0, 2).join(", ") || "—"
							})
						]
					}, event.id)) })]
				})
			})
		]
	});
}
//#endregion
export { LedgerPage as component };
