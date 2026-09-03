import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as readToken, c as canPickFolder, d as pickFolder, f as scanFolder, l as clearFolder, o as useStation, r as pullTheRecord, s as writeToken, u as folderName } from "./router-BiTPZ2ht.mjs";
import { a as absTime, i as Panel, n as Button, r as PageHeader, t as Badge } from "./panel-DZwo9SyZ.mjs";
import { t as Input } from "./input-BsBdtsnN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/station-BeIf1uFQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StationPage() {
	const settings = useStation((s) => s.settings);
	const watches = useStation((s) => s.watches);
	const repos = useStation((s) => s.repos);
	const lastFetchedAt = useStation((s) => s.lastFetchedAt);
	const rateRemaining = useStation((s) => s.rateRemaining);
	const folderLabel = useStation((s) => s.folderLabel);
	const [user, setUser] = (0, import_react.useState)(settings.githubUser);
	const [org, setOrg] = (0, import_react.useState)(settings.githubOrg);
	const [station, setStation] = (0, import_react.useState)(settings.stationName);
	const [poll, setPoll] = (0, import_react.useState)(String(settings.pollSeconds));
	const [token, setToken] = (0, import_react.useState)("");
	const [hasToken, setHasToken] = (0, import_react.useState)(false);
	const [watchPath, setWatchPath] = (0, import_react.useState)("");
	const [watchNote, setWatchNote] = (0, import_react.useState)("");
	const picker = canPickFolder();
	(0, import_react.useEffect)(() => {
		setHasToken(Boolean(readToken()));
	}, []);
	function saveIdentity(e) {
		e.preventDefault();
		const seconds = Number(poll);
		useStation.getState().setSettings({
			githubUser: user.trim() || "EverettNC",
			githubOrg: org.trim(),
			stationName: station.trim() || "Home Station",
			pollSeconds: Number.isFinite(seconds) ? Math.min(900, Math.max(60, seconds)) : 180
		});
		toast("Station saved.");
	}
	function saveToken(e) {
		e.preventDefault();
		writeToken(token);
		setHasToken(Boolean(token.trim()));
		setToken("");
		toast(token.trim() ? "Token kept in this browser only." : "Token cleared.");
	}
	async function attach() {
		try {
			const name = await pickFolder();
			if (!name) {
				toast("This browser cannot attach a folder.");
				return;
			}
			useStation.getState().setFolderLabel(name);
			const events = await scanFolder(settings.githubUser);
			for (const event of events) useStation.getState().addEvent(event);
			toast(`Attached ${name}.`);
		} catch {
			toast("Folder attach cancelled.");
		}
	}
	function detach() {
		clearFolder();
		useStation.getState().setFolderLabel(null);
		toast("Folder detached.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Station",
				title: "How the watch is seated.",
				children: "GitHub is pulled live. A personal token is optional and never leaves this browser except toward api.github.com. Without it, only the public record is visible."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl",
					children: "Channels"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "This desk is yours with no subscription. GitHub public events pull without a token. Optional GitHub token stays in this browser. Mail, calendar, Outlook, and Teams load only if already seated in Grok — optional, never required. Calls, SMS, iMessage, Signal, and WhatsApp are recorded by hand. Arm Honesty to scan GitHub, mail, the wire, and named AIs — then follow each in the record. It cannot see other programs on the computer. Kernel file-opens and phone taps are not claimed."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: saveIdentity,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl",
							children: "Identity"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["Station name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-2",
								value: station,
								onChange: (e) => setStation(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["GitHub user", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-2",
								value: user,
								onChange: (e) => setUser(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["GitHub org (optional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-2",
								value: org,
								onChange: (e) => setOrg(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["Poll while armed (seconds)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-2",
								type: "number",
								min: 60,
								max: 900,
								value: poll,
								onChange: (e) => setPoll(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Save station"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: saveToken,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl",
							children: "GitHub token"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: ["Classic or fine-grained, read-only on repo and metadata. Private files stay hidden without it. ", hasToken ? "A token is on file." : "No token on file."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							autoComplete: "off",
							value: token,
							onChange: (e) => setToken(e.target.value),
							placeholder: hasToken ? "Replace token" : "ghp_…",
							"aria-label": "GitHub token"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "Keep token"
							}), hasToken ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => {
									writeToken("");
									setHasToken(false);
									setToken("");
									toast("Token cleared.");
								},
								children: "Clear"
							}) : null]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl",
						children: "Attached folder"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Chromium can watch last-modified times on a folder you pick. It cannot see who at the operating system opened a file. Re-attach after a refresh."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-mono text-xs text-subtle",
						children: folderLabel || folderName() || "No folder attached"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							onClick: () => void attach(),
							disabled: !picker,
							children: "Attach folder"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: detach,
							children: "Detach"
						})]
					}),
					!picker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "This browser has no folder picker. Record openings on the ledger instead."
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl",
						children: "Named watches"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-3 flex flex-col gap-3 sm:flex-row",
						onSubmit: (e) => {
							e.preventDefault();
							if (!watchPath.trim()) return;
							useStation.getState().addWatch(watchPath, watchNote);
							setWatchPath("");
							setWatchNote("");
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: watchPath,
								onChange: (e) => setWatchPath(e.target.value),
								placeholder: "Path or seat",
								"aria-label": "Watch path"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: watchNote,
								onChange: (e) => setWatchNote(e.target.value),
								placeholder: "Note",
								"aria-label": "Watch note"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "secondary",
								children: "Add"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 divide-y divide-border",
						children: watches.map((watch) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start justify-between gap-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs",
								children: watch.path
							}), watch.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: watch.note
							}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => useStation.getState().removeWatch(watch.id),
								children: "Remove"
							})]
						}, watch.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl",
							children: "Repositories in view"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => void pullTheRecord(),
								children: "Refresh"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => {
									useStation.getState().clearLedger();
									toast("Ledger cleared. Pull again for a clean record.");
								},
								children: "Clear ledger"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-xs text-subtle",
						children: [lastFetchedAt ? `Last pull ${absTime(lastFetchedAt)}` : "Not pulled", rateRemaining != null ? ` · GitHub remaining ${rateRemaining}` : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-3",
						children: repos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-muted",
							children: "No repositories returned."
						}) : repos.map((repo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: repo.html_url,
									target: "_blank",
									rel: "noreferrer",
									className: "truncate text-sm font-medium text-muted hover:text-fg",
									children: repo.full_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-subtle",
									children: [repo.language ?? "—", repo.pushed_at ? ` · pushed ${absTime(repo.pushed_at)}` : ""]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-1",
								children: repo.private ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "danger",
									children: "private"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "public" })
							})]
						}, repo.full_name))
					})
				]
			})
		]
	});
}
//#endregion
export { StationPage as component };
