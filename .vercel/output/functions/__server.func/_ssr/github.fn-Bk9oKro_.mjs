import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { f as sanitizeLogin, l as isValidLogin, s as isOnStation, u as mapGhEvent } from "./github-k11way4X.mjs";
import { a as string, i as object, t as array } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/github.fn-Bk9oKro_.js
var Input = object({
	username: string().min(1).max(80),
	org: string().max(80).optional(),
	token: string().max(240).optional(),
	knownShas: array(string().max(64)).max(40).optional()
});
async function ghJson(path, token, warnings, remaining) {
	const headers = {
		Accept: "application/vnd.github+json",
		"User-Agent": "Honesty-Above-All-Else",
		"X-GitHub-Api-Version": "2022-11-28"
	};
	if (token) headers.Authorization = `Bearer ${token}`;
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 12e3);
	try {
		const res = await fetch(`https://api.github.com${path}`, {
			headers,
			signal: controller.signal
		});
		const left = res.headers.get("x-ratelimit-remaining");
		if (left) remaining.value = Number(left);
		if (res.status === 403 || res.status === 429) {
			warnings.push("GitHub asked the desk to slow down. Try again in a minute.");
			return null;
		}
		if (res.status === 401) {
			warnings.push("The token was refused. Clear it or paste a new one.");
			return null;
		}
		if (res.status === 404) return null;
		if (!res.ok) {
			warnings.push(`GitHub returned ${res.status} for ${path}.`);
			return null;
		}
		return await res.json();
	} catch (err) {
		const message = err instanceof Error ? err.message : "network error";
		warnings.push(`Could not reach GitHub (${message}).`);
		return null;
	} finally {
		clearTimeout(timer);
	}
}
var pullStation_createServerFn_handler = createServerRpc({
	id: "68232eaaed01028ef324fcfed5aee9291d9ff0f16bed9d7b9172f1b90559a398",
	name: "pullStation",
	filename: "src/lib/github.fn.ts"
}, (opts) => pullStation.__executeServer(opts));
var pullStation = createServerFn({ method: "POST" }).validator(Input).handler(pullStation_createServerFn_handler, async ({ data }) => {
	const warnings = [];
	const remaining = { value: null };
	const username = sanitizeLogin(data.username);
	if (!isValidLogin(username)) return {
		ok: false,
		profile: null,
		events: [],
		repos: [],
		warnings: ["That GitHub name is not a valid login."],
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
		rateRemaining: null
	};
	const token = data.token?.trim() || void 0;
	const orgRaw = data.org ? sanitizeLogin(data.org) : "";
	const org = orgRaw && isValidLogin(orgRaw) ? orgRaw : "";
	const eventsPath = token ? `/users/${username}/events?per_page=40` : `/users/${username}/events/public?per_page=40`;
	const [profile, ownEvents, reposRaw, orgEvents] = await Promise.all([
		ghJson(`/users/${username}`, token, warnings, remaining),
		ghJson(eventsPath, token, warnings, remaining),
		ghJson(`/users/${username}/repos?sort=pushed&per_page=20&type=all`, token, warnings, remaining),
		org ? ghJson(`/orgs/${org}/events?per_page=30`, token, warnings, remaining) : Promise.resolve(null)
	]);
	const repos = (reposRaw ?? []).map((repo) => ({
		full_name: typeof repo.full_name === "string" ? repo.full_name : "",
		html_url: typeof repo.html_url === "string" ? repo.html_url : "",
		private: Boolean(repo.private),
		pushed_at: typeof repo.pushed_at === "string" ? repo.pushed_at : null,
		language: typeof repo.language === "string" ? repo.language : null,
		stargazers_count: typeof repo.stargazers_count === "number" ? repo.stargazers_count : 0,
		forks_count: typeof repo.forks_count === "number" ? repo.forks_count : 0,
		description: typeof repo.description === "string" ? repo.description : null
	})).filter((repo) => repo.full_name);
	const watchRepos = token ? repos.filter((repo) => !repo.private || Boolean(token)).filter((repo) => isOnStation(repo.full_name, username, org)).slice(0, 6) : [];
	const repoEventLists = token ? await Promise.all(watchRepos.map((repo) => ghJson(`/repos/${repo.full_name}/events?per_page=15`, token, warnings, remaining))) : [];
	const mapped = [];
	for (const raw of [
		...ownEvents ?? [],
		...orgEvents ?? [],
		...repoEventLists.flatMap((list) => list ?? [])
	]) {
		const event = mapGhEvent(raw);
		if (!event) continue;
		if (event.repo && !isOnStation(event.repo, username, org)) continue;
		mapped.push(event);
	}
	const known = new Set(data.knownShas ?? []);
	const toEnrich = mapped.filter((event) => event.kind === "push" && event.sha && event.repo).filter((event) => event.sha && !known.has(event.sha)).slice(0, token ? 4 : 1);
	await Promise.all(toEnrich.map(async (event) => {
		if (!event.repo || !event.sha) return;
		const commit = await ghJson(`/repos/${event.repo}/commits/${event.sha}`, token, warnings, remaining);
		if (!commit) return;
		event.files = (commit.files ?? []).map((file) => file.filename).filter((name) => Boolean(name)).slice(0, 40);
		if (commit.html_url) event.url = commit.html_url;
		const n = event.files.length;
		if (n) event.summary = `Touched ${n} file${n === 1 ? "" : "s"} in ${event.repo}`;
	}));
	if (!profile && mapped.length === 0 && repos.length === 0) warnings.push(`No public GitHub record found for ${username}.`);
	return {
		ok: mapped.length > 0 || Boolean(profile),
		profile: profile ?? null,
		events: mapped,
		repos,
		warnings: [...new Set(warnings)],
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
		rateRemaining: remaining.value
	};
});
//#endregion
export { pullStation_createServerFn_handler };
