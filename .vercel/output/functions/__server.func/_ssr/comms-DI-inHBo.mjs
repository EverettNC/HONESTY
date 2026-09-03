import { o as isComms } from "./github-k11way4X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/comms-DI-inHBo.js
function counterpartOf(event) {
	return (event.counterpart || event.actorLogin).trim() || "unknown";
}
function deriveChannels(events) {
	const comms = events.filter(isComms);
	const mail = comms.filter((event) => event.kind === "mail").length;
	const call = comms.filter((event) => event.kind === "call").length;
	const message = comms.filter((event) => event.kind === "message").length;
	const meeting = comms.filter((event) => event.kind === "meeting").length;
	const github = comms.filter((event) => event.source === "github").length;
	const hand = comms.filter((event) => event.source === "wire").length;
	return [
		{
			key: "all",
			label: "On the wire",
			count: comms.length
		},
		{
			key: "mail",
			label: "Mail",
			count: mail
		},
		{
			key: "call",
			label: "Call",
			count: call
		},
		{
			key: "message",
			label: "Text",
			count: message
		},
		{
			key: "meeting",
			label: "Meeting",
			count: meeting
		},
		{
			key: "github",
			label: "GitHub",
			count: github
		},
		{
			key: "hand",
			label: "Recorded",
			count: hand
		}
	];
}
function deriveThreads(events) {
	const map = /* @__PURE__ */ new Map();
	const chronological = [...events].filter(isComms).sort((a, b) => a.at < b.at ? -1 : 1);
	for (const event of chronological) {
		const who = counterpartOf(event);
		const key = who.toLowerCase();
		const prior = map.get(key);
		const kinds = new Set(prior?.kinds ?? []);
		kinds.add(event.kind);
		map.set(key, {
			key,
			who,
			count: (prior?.count ?? 0) + 1,
			lastAt: event.at,
			lastSummary: event.summary,
			lastKind: event.kind,
			kinds: [...kinds]
		});
	}
	return [...map.values()].sort((a, b) => a.lastAt < b.lastAt ? 1 : -1);
}
var DIRECTION_LABEL = {
	in: "In",
	out: "Out",
	with: "With"
};
//#endregion
export { deriveThreads as i, counterpartOf as n, deriveChannels as r, DIRECTION_LABEL as t };
