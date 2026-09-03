import { t as createServerFn } from "./ssr.mjs";
import { t as isLoginRequired } from "./login-C214iVwo.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wire.fn-BEHymTuG.js
var ConnectorType = {
	GoogleDrive: "GoogleDrive",
	Gmail: "Gmail",
	GoogleCalendar: "GoogleCalendar",
	Outlook: "Outlook",
	OutlookCalendar: "OutlookCalendar",
	MicrosoftTeams: "MicrosoftTeams",
	Mcp: "Mcp"
};
function classifyCallToolError(result) {
	if (result.ok) return null;
	const detail = result.errorMessage || void 0;
	const raw = (result.errorMessage ?? "").toLowerCase();
	if (isLoginRequired(result)) return {
		kind: "login",
		message: "Continue with Grok to load your data.",
		detail
	};
	if (raw.includes("not_connected") || raw.includes("failed_precondition")) return {
		kind: "not_connected",
		message: "Connect this connector in Grok to load your data.",
		detail
	};
	if (raw.includes("scope_denied")) return {
		kind: "scope_denied",
		message: "This view isn't available — the app requested a tool outside its grant.",
		detail
	};
	if (raw.includes("access_denied")) return {
		kind: "access_denied",
		message: "You don't have access to this data.",
		detail
	};
	return {
		kind: "error",
		message: detail ?? "Something went wrong. Try again.",
		detail
	};
}
function asRecord(value) {
	if (value && typeof value === "object" && !Array.isArray(value)) return value;
	return null;
}
function asString(value) {
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function pick(record, keys) {
	for (const key of keys) {
		const hit = asString(record[key]);
		if (hit) return hit;
	}
}
function collectRows(data) {
	if (Array.isArray(data)) return data.map(asRecord).filter((row) => Boolean(row));
	const root = asRecord(data);
	if (!root) return [];
	for (const key of [
		"threads",
		"emails",
		"messages",
		"events",
		"items",
		"results",
		"data",
		"chats",
		"value"
	]) {
		const nested = root[key];
		if (Array.isArray(nested)) return collectRows(nested);
		const inner = asRecord(nested);
		if (inner) {
			const deeper = collectRows(inner);
			if (deeper.length) return deeper;
		}
	}
	return [root];
}
function parseDate(raw) {
	if (!raw) return (/* @__PURE__ */ new Date()).toISOString();
	const asNum = Number(raw);
	if (Number.isFinite(asNum) && asNum > 1e9) {
		const ms = asNum < 0xe8d4a51000 ? asNum * 1e3 : asNum;
		return new Date(ms).toISOString();
	}
	const parsed = new Date(raw);
	if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
	return (/* @__PURE__ */ new Date()).toISOString();
}
function parsePerson(raw) {
	if (!raw) return { login: "unknown" };
	const cleaned = raw.replace(/\s+/g, " ").trim();
	const angle = cleaned.match(/^(?:"?([^"<]+)"?\s*)?<([^>]+)>$/);
	if (angle) {
		const name = angle[1]?.trim();
		const email = angle[2]?.trim();
		if (email) return {
			login: email.slice(0, 80),
			name: name || void 0
		};
	}
	const quoted = cleaned.match(/^"([^"]+)"\s*(.*)$/);
	if (quoted) return {
		login: (quoted[2] || quoted[1]).slice(0, 80),
		name: quoted[1]
	};
	return { login: cleaned.replace(/^"|"$/g, "").slice(0, 80) };
}
function listPeople(record, keys) {
	const out = [];
	for (const key of keys) {
		const value = record[key];
		if (typeof value === "string" && value.trim()) for (const part of value.split(/[,;]/)) {
			const person = parsePerson(part).login;
			if (person && person !== "unknown") out.push(person);
		}
		if (Array.isArray(value)) for (const item of value) if (typeof item === "string") {
			const person = parsePerson(item).login;
			if (person && person !== "unknown") out.push(person);
		} else {
			const row = asRecord(item);
			if (row) {
				const person = pick(row, [
					"email",
					"address",
					"displayName",
					"name",
					"emailAddress"
				]) ?? parsePerson(pick(row, ["emailAddress"])).login;
				const nested = asRecord(row.emailAddress);
				const login = (nested ? pick(nested, ["address", "name"]) : void 0) ?? person;
				if (login && login !== "unknown") out.push(login);
			}
		}
	}
	return [...new Set(out)];
}
function snippetOf(record) {
	const direct = pick(record, [
		"snippet",
		"preview",
		"text",
		"summary",
		"bodyPreview",
		"body"
	]);
	if (direct) return direct.slice(0, 180);
	const body = asRecord(record.body);
	if (body) {
		const content = pick(body, [
			"content",
			"text",
			"plain",
			"data"
		]);
		if (content) return content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 180);
	}
}
function mapMailRows(data, extras = {}) {
	const source = extras.source ?? "mail";
	const prefix = extras.idPrefix ?? source;
	const events = [];
	for (const row of collectRows(data)) {
		const subject = pick(row, [
			"subject",
			"title",
			"Subject"
		]) ?? "(no subject)";
		const from = parsePerson(pick(row, [
			"from",
			"sender",
			"From",
			"fromName",
			"author",
			"organizer"
		]));
		const toPeople = listPeople(row, [
			"to",
			"toRecipients",
			"recipients",
			"cc"
		]);
		const direction = extras.direction ?? (pick(row, [
			"label",
			"folder",
			"labelIds"
		])?.toLowerCase().includes("sent") ? "out" : "in");
		const counterpart = direction === "out" ? toPeople[0] ?? from.login : from.login;
		const id = pick(row, [
			"id",
			"threadId",
			"messageId",
			"thread_id",
			"internetMessageId"
		]) ?? `${from.login}-${subject}`.slice(0, 80);
		const url = pick(row, [
			"url",
			"html_url",
			"permalink",
			"link",
			"webLink"
		]);
		const at = parseDate(pick(row, [
			"date",
			"internalDate",
			"timestamp",
			"receivedAt",
			"receivedDateTime",
			"sentDateTime"
		]));
		const snippet = snippetOf(row);
		const who = direction === "out" ? counterpart : from.name ?? from.login;
		events.push({
			id: `${prefix}-${id}`,
			at,
			kind: "mail",
			source,
			actorLogin: direction === "out" ? counterpart : from.login,
			actorName: from.name,
			files: [],
			summary: snippet ? `Mail: ${subject} — ${snippet}` : `Mail: ${subject}`,
			url,
			direction,
			counterpart: who,
			subject,
			threadId: pick(row, [
				"threadId",
				"conversationId",
				"thread_id"
			]) ?? id
		});
	}
	return events;
}
function mapCalendarRows(data, extras = {}) {
	const source = extras.source ?? "calendar";
	const prefix = extras.idPrefix ?? source;
	const events = [];
	for (const row of collectRows(data)) {
		const title = pick(row, [
			"summary",
			"title",
			"subject",
			"name"
		]) ?? "(untitled meeting)";
		const organizer = parsePerson(pick(row, [
			"organizer",
			"creator",
			"organizerEmail"
		]) ?? (asRecord(row.organizer) ? pick(asRecord(row.organizer), [
			"email",
			"displayName",
			"name"
		]) : void 0));
		const attendees = listPeople(row, [
			"attendees",
			"attendee",
			"participants",
			"requiredAttendees"
		]);
		const startRow = asRecord(row.start);
		const at = parseDate(pick(row, [
			"start",
			"startTime",
			"start_time",
			"dateTime",
			"when"
		]) ?? (startRow ? pick(startRow, ["dateTime", "date"]) : void 0));
		const id = pick(row, [
			"id",
			"iCalUID",
			"icalUid",
			"eventId"
		]) ?? `${title}-${at}`;
		const url = pick(row, [
			"htmlLink",
			"html_url",
			"url",
			"webLink",
			"hangoutLink"
		]);
		const location = pick(row, [
			"location",
			"hangoutLink",
			"conferenceData"
		]);
		const withWho = attendees.filter((person) => person !== organizer.login).slice(0, 4);
		const whoLine = withWho.length ? withWho.join(", ") : organizer.login;
		events.push({
			id: `${prefix}-${id}`,
			at,
			kind: "meeting",
			source,
			actorLogin: organizer.login,
			actorName: organizer.name,
			files: [],
			summary: location ? `Meeting: ${title} · ${location}` : `Meeting: ${title} with ${whoLine}`,
			url,
			direction: "with",
			counterpart: whoLine,
			subject: title,
			threadId: id
		});
	}
	return events;
}
function mapChatRows(data, extras = {}) {
	const source = extras.source ?? "teams";
	const kind = extras.kind ?? "message";
	const prefix = extras.idPrefix ?? source;
	const events = [];
	for (const row of collectRows(data)) {
		const from = parsePerson(pick(row, [
			"from",
			"sender",
			"author",
			"user",
			"displayName"
		]) ?? (asRecord(row.from) ? pick(asRecord(row.from), [
			"name",
			"displayName",
			"email",
			"userPrincipalName"
		]) : void 0) ?? (asRecord(asRecord(row.from)?.user) ? pick(asRecord(asRecord(row.from)?.user), ["displayName", "email"]) : void 0));
		const body = snippetOf(row) ?? pick(row, [
			"content",
			"message",
			"text"
		]);
		const channel = pick(row, [
			"channel",
			"channelName",
			"chat",
			"chatType",
			"topic",
			"subject"
		]);
		const id = pick(row, [
			"id",
			"messageId",
			"chatId"
		]) ?? `${from.login}-${body ?? "msg"}`.slice(0, 80);
		const at = parseDate(pick(row, [
			"createdDateTime",
			"created_at",
			"timestamp",
			"date",
			"lastModifiedDateTime"
		]));
		const url = pick(row, [
			"webUrl",
			"url",
			"link"
		]);
		const label = source === "teams" ? "Teams" : "Chat";
		events.push({
			id: `${prefix}-${id}`,
			at,
			kind,
			source,
			actorLogin: from.login,
			actorName: from.name,
			files: [],
			summary: body ? `${label}${channel ? ` · ${channel}` : ""}: ${body}` : `${label}${channel ? ` · ${channel}` : ""} message`,
			url,
			direction: "with",
			counterpart: from.name ?? from.login,
			subject: channel,
			threadId: pick(row, [
				"chatId",
				"channelId",
				"threadId"
			]) ?? id
		});
	}
	return events;
}
var wire_fn_exports = /* @__PURE__ */ __exportAll({ pullWire_createServerFn_handler: () => pullWire_createServerFn_handler });
function windowIso(daysBack, daysForward = 0) {
	return {
		start: (/* @__PURE__ */ new Date(Date.now() - daysBack * 24 * 60 * 60 * 1e3)).toISOString(),
		end: new Date(Date.now() + daysForward * 24 * 60 * 60 * 1e3).toISOString()
	};
}
async function runTool(callTool, toolName, args, connectorType) {
	return callTool(toolName, args, { connectorType });
}
function fromResult(id, label, result, events) {
	if (result.ok) return {
		id,
		label,
		events,
		seated: true,
		note: events.length ? null : `${label} seated, nothing in the last 21 days.`,
		loginRequired: false
	};
	const classified = classifyCallToolError(result);
	const kind = classified?.kind;
	return {
		id,
		label,
		events: [],
		seated: false,
		note: kind === "login" || kind === "not_connected" || kind === "access_denied" || kind === "scope_denied" ? `${label} not seated.` : classified?.message ?? result.errorMessage ?? `${label} could not be pulled.`,
		loginRequired: Boolean(result.loginRequired) || kind === "login",
		loginUrl: result.loginUrl
	};
}
var pullWire_createServerFn_handler = createServerRpc({
	id: "bc137a2bfc1be320ba421634b6768d801045a86ac96c6c44e9187849cbb7299c",
	name: "pullWire",
	filename: "src/lib/wire.fn.ts"
}, (opts) => pullWire.__executeServer(opts));
var pullWire = createServerFn({ method: "POST" }).handler(pullWire_createServerFn_handler, async () => {
	const fetchedAt = (/* @__PURE__ */ new Date()).toISOString();
	const { start, end } = windowIso(21, 7);
	const { callTool } = await import("./client.server-B_-RKzOp.mjs");
	const calArgs = {
		query: "",
		time_min: start,
		time_max: end,
		timeMin: start,
		timeMax: end,
		max_results: 40,
		maxResults: 40
	};
	const [gmailAll, gmailSent, calendar, outlook, outlookCal, teams] = await Promise.all([
		runTool(callTool, "gmail_search", {
			query: "newer_than:21d",
			max_results: 40
		}, ConnectorType.Gmail),
		runTool(callTool, "gmail_search", {
			query: "in:sent newer_than:21d",
			max_results: 25
		}, ConnectorType.Gmail),
		runTool(callTool, "google_calendar_search", calArgs, ConnectorType.GoogleCalendar),
		runTool(callTool, "outlook_search", {
			query: "newer_than:21d",
			max_results: 25
		}, ConnectorType.Outlook),
		runTool(callTool, "outlook_calendar_search", calArgs, ConnectorType.OutlookCalendar),
		runTool(callTool, "microsoft_teams_search", {
			query: "",
			max_results: 25
		}, ConnectorType.MicrosoftTeams)
	]);
	const attempts = [
		fromResult("gmail", "Gmail", gmailAll, mapMailRows(gmailAll.data, {
			source: "mail",
			direction: "in"
		})),
		fromResult("gmail-sent", "Gmail sent", gmailSent, mapMailRows(gmailSent.data, {
			source: "mail",
			direction: "out",
			idPrefix: "mail-sent"
		})),
		fromResult("calendar", "Google Calendar", calendar, mapCalendarRows(calendar.data, { source: "calendar" })),
		fromResult("outlook", "Outlook", outlook, mapMailRows(outlook.data, {
			source: "outlook",
			idPrefix: "outlook"
		})),
		fromResult("outlook-cal", "Outlook Calendar", outlookCal, mapCalendarRows(outlookCal.data, {
			source: "outlook",
			idPrefix: "outlook-cal"
		})),
		fromResult("teams", "Teams", teams, mapChatRows(teams.data, { source: "teams" }))
	];
	const events = attempts.flatMap((attempt) => attempt.events);
	const seated = attempts.filter((attempt) => attempt.seated);
	const loginHit = attempts.find((attempt) => attempt.loginRequired && attempt.loginUrl);
	const loginRequired = attempts.some((attempt) => attempt.loginRequired);
	const sources = [
		{
			id: "gmail",
			label: "Gmail",
			seated: attempts[0].seated || attempts[1].seated,
			count: (attempts[0]?.events.length ?? 0) + (attempts[1]?.events.length ?? 0),
			note: attempts[0].seated || attempts[1].seated ? null : "Gmail not seated."
		},
		{
			id: "calendar",
			label: "Calendar",
			seated: attempts[2].seated,
			count: attempts[2].events.length,
			note: attempts[2].note
		},
		{
			id: "outlook",
			label: "Outlook",
			seated: attempts[3].seated || attempts[4].seated,
			count: (attempts[3]?.events.length ?? 0) + (attempts[4]?.events.length ?? 0),
			note: attempts[3].seated || attempts[4].seated ? null : "Outlook not seated."
		},
		{
			id: "teams",
			label: "Teams",
			seated: attempts[5].seated,
			count: attempts[5].events.length,
			note: attempts[5].note
		}
	];
	let warning = null;
	if (seated.length === 0) warning = "Mail, calendar, Outlook, and Teams are optional. This desk is yours either way. Record calls, texts, and meetings by hand. Pull the wire loads seated channels when they exist.";
	else {
		const missing = sources.filter((source) => !source.seated).map((source) => source.label);
		if (missing.length) warning = `${missing.join(", ")} optional — not seated.`;
	}
	return {
		ok: events.length > 0 || seated.length > 0,
		events,
		warning,
		loginRequired,
		loginUrl: loginHit?.loginUrl,
		fetchedAt,
		sources
	};
});
//#endregion
export { ConnectorType as r, wire_fn_exports as t };
