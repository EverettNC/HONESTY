//#region node_modules/.nitro/vite/services/ssr/assets/github-k11way4X.js
var KIND_BY_TYPE = {
	PushEvent: "push",
	WatchEvent: "star",
	ForkEvent: "fork",
	IssuesEvent: "issue",
	IssueCommentEvent: "comment",
	PullRequestEvent: "pull",
	PullRequestReviewEvent: "pull",
	PullRequestReviewCommentEvent: "comment",
	MemberEvent: "member",
	PublicEvent: "other",
	FollowEvent: "follow",
	ReleaseEvent: "release",
	CreateEvent: "create",
	DeleteEvent: "delete",
	CommitCommentEvent: "comment"
};
function asString(value) {
	return typeof value === "string" && value.length > 0 ? value : void 0;
}
function asNumber(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function sanitizeLogin(raw) {
	return raw.trim().replace(/^@/, "").slice(0, 80);
}
function isValidLogin(raw) {
	return /^[A-Za-z0-9-]{1,39}$/.test(raw);
}
function mapGhEvent(raw) {
	const id = raw.id != null ? `gh-${raw.id}` : null;
	const at = asString(raw.created_at);
	const actorLogin = asString(raw.actor?.login) ?? asString(raw.actor?.display_login);
	if (!id || !at || !actorLogin) return null;
	const repo = asString(raw.repo?.name);
	const payload = raw.payload ?? {};
	const kind = KIND_BY_TYPE[raw.type ?? ""] ?? "other";
	const avatar = asString(raw.actor?.avatar_url);
	const sha = asString(payload.head) ?? asString(payload.sha);
	const files = [];
	const commits = Array.isArray(payload.commits) ? payload.commits : [];
	for (const commit of commits) if (commit && typeof commit === "object" && "message" in commit) {}
	return {
		id,
		at,
		kind,
		source: "github",
		actorLogin,
		actorAvatar: avatar,
		repo,
		files,
		summary: summarize(kind, repo, payload, actorLogin),
		url: eventUrl(kind, repo, payload, sha),
		sha,
		direction: kind === "comment" || kind === "issue" || kind === "pull" ? "with" : void 0,
		counterpart: actorLogin,
		subject: titleFromPayload(payload)
	};
}
function titleFromPayload(payload) {
	const issue = payload.issue;
	const pr = payload.pull_request;
	return (issue && typeof issue === "object" && "title" in issue ? asString(issue.title) : void 0) ?? (pr && typeof pr === "object" && "title" in pr ? asString(pr.title) : void 0);
}
function summarize(kind, repo, payload, actor) {
	const place = repo ?? "GitHub";
	const action = asString(payload.action);
	const size = asNumber(payload.size);
	const ref = asString(payload.ref)?.replace(/^refs\/heads\//, "");
	const issue = payload.issue;
	const pr = payload.pull_request;
	const title = (issue && typeof issue === "object" && "title" in issue ? asString(issue.title) : void 0) ?? (pr && typeof pr === "object" && "title" in pr ? asString(pr.title) : void 0);
	switch (kind) {
		case "push": return `Pushed ${size ?? 1} commit${size === 1 ? "" : "s"} to ${place}${ref ? ` (${ref})` : ""}`;
		case "star": return `Starred ${place}`;
		case "fork": return `Forked ${place}`;
		case "issue": return `${cap(action ?? "touched")} issue${title ? `: ${title}` : ""} on ${place}`;
		case "pull": return `${cap(action ?? "touched")} pull request${title ? `: ${title}` : ""} on ${place}`;
		case "member": return `${cap(action ?? "changed")} collaborator access on ${place}`;
		case "follow": return `${actor} followed the account`;
		case "release": return `${cap(action ?? "published")} a release on ${place}`;
		case "create": return `Created ${asString(payload.ref_type) ?? "ref"} ${ref ?? ""} on ${place}`.trim();
		case "delete": return `Deleted ${asString(payload.ref_type) ?? "ref"} ${ref ?? ""} on ${place}`.trim();
		case "comment": return `Commented on ${place}${title ? `: ${title}` : ""}`;
		default: return `Activity on ${place}`;
	}
}
function eventUrl(kind, repo, payload, sha) {
	if (sha && repo) return `https://github.com/${repo}/commit/${sha}`;
	const issue = payload.issue;
	if (issue && typeof issue === "object" && "html_url" in issue) return asString(issue.html_url);
	const pr = payload.pull_request;
	if (pr && typeof pr === "object" && "html_url" in pr) return asString(pr.html_url);
	const comment = payload.comment;
	if (comment && typeof comment === "object" && "html_url" in comment) return asString(comment.html_url);
	if (repo) return `https://github.com/${repo}`;
}
function cap(value) {
	return value.length ? value[0].toUpperCase() + value.slice(1) : value;
}
function mergeEvents(existing, incoming) {
	const map = /* @__PURE__ */ new Map();
	for (const event of existing) map.set(event.id, event);
	for (const event of incoming) {
		const prior = map.get(event.id);
		if (!prior) {
			map.set(event.id, event);
			continue;
		}
		map.set(event.id, {
			...prior,
			...event,
			files: event.files.length ? event.files : prior.files,
			counterpart: event.counterpart ?? prior.counterpart,
			direction: event.direction ?? prior.direction,
			subject: event.subject ?? prior.subject,
			threadId: event.threadId ?? prior.threadId
		});
	}
	return [...map.values()].sort((a, b) => a.at < b.at ? 1 : a.at > b.at ? -1 : 0).slice(0, 800);
}
function deriveFiles(events) {
	const map = /* @__PURE__ */ new Map();
	const chronological = [...events].sort((a, b) => a.at < b.at ? -1 : 1);
	for (const event of chronological) {
		const paths = event.files.length > 0 ? event.files : event.repo ? [`${event.repo}`] : [];
		for (const path of paths) {
			const key = `${event.source}:${path}`;
			const prior = map.get(key);
			map.set(key, {
				path,
				repo: event.repo,
				source: event.source,
				lastAt: event.at,
				lastActor: event.actorLogin,
				lastKind: event.kind,
				count: (prior?.count ?? 0) + 1
			});
		}
	}
	return [...map.values()].sort((a, b) => a.lastAt < b.lastAt ? 1 : -1);
}
function deriveActors(events) {
	const map = /* @__PURE__ */ new Map();
	for (const event of events) {
		const key = event.actorLogin.toLowerCase();
		const prior = map.get(key);
		const files = new Set(prior?.files ?? []);
		for (const file of event.files) files.add(file);
		if (!event.files.length && event.repo) files.add(event.repo);
		const kinds = new Set(prior?.kinds ?? []);
		kinds.add(event.kind);
		const lastAt = !prior?.lastAt || event.at > prior.lastAt ? event.at : prior.lastAt;
		map.set(key, {
			login: event.actorLogin,
			name: event.actorName ?? prior?.name,
			avatar: event.actorAvatar ?? prior?.avatar,
			eventCount: (prior?.eventCount ?? 0) + 1,
			lastAt,
			files: [...files],
			kinds: [...kinds]
		});
	}
	return [...map.values()].sort((a, b) => b.eventCount - a.eventCount);
}
function isOnStation(repo, user, org) {
	if (!repo) return false;
	const lower = repo.toLowerCase();
	const owner = user.trim().toLowerCase();
	const group = org.trim().toLowerCase();
	if (owner && (lower === owner || lower.startsWith(`${owner}/`))) return true;
	if (group && (lower === group || lower.startsWith(`${group}/`))) return true;
	return false;
}
function belongsToStation(event, user, org) {
	if (event.source === "home" || event.source === "mail" || event.source === "wire" || event.source === "calendar" || event.source === "outlook" || event.source === "teams") return true;
	if (event.repo) return isOnStation(event.repo, user, org);
	return event.actorLogin.toLowerCase() === user.trim().toLowerCase();
}
function isTrustedActor(login, owner, known) {
	const needle = login.toLowerCase();
	if (needle === owner.trim().toLowerCase()) return true;
	return known.some((name) => name.toLowerCase() === needle);
}
var KIND_LABEL = {
	push: "Push",
	star: "Star",
	fork: "Fork",
	issue: "Issue",
	pull: "Pull",
	member: "Access",
	follow: "Follow",
	release: "Release",
	create: "Create",
	delete: "Delete",
	comment: "Comment",
	open: "Open",
	modify: "Modify",
	mail: "Mail",
	call: "Call",
	message: "Text",
	meeting: "Meeting",
	other: "Activity"
};
var SOURCE_LABEL = {
	github: "GitHub",
	home: "Home",
	mail: "Mail",
	wire: "Wire",
	calendar: "Calendar",
	outlook: "Outlook",
	teams: "Teams"
};
function isComms(event) {
	if (event.source === "mail" || event.source === "wire" || event.source === "calendar" || event.source === "outlook" || event.source === "teams") return true;
	return event.kind === "comment" || event.kind === "issue" || event.kind === "pull" || event.kind === "mail" || event.kind === "call" || event.kind === "message" || event.kind === "meeting";
}
//#endregion
export { deriveFiles as a, isTrustedActor as c, mergeEvents as d, sanitizeLogin as f, deriveActors as i, isValidLogin as l, SOURCE_LABEL as n, isComms as o, belongsToStation as r, isOnStation as s, KIND_LABEL as t, mapGhEvent as u };
