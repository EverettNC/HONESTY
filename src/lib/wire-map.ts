import type { AccessEvent, CommDirection, EventKind, EventSource } from "./types";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function pick(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const hit = asString(record[key]);
    if (hit) return hit;
  }
  return undefined;
}

export function collectRows(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) {
    return data.map(asRecord).filter((row): row is Record<string, unknown> => Boolean(row));
  }
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
    "value",
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

export function parseDate(raw: string | undefined): string {
  if (!raw) return new Date().toISOString();
  const asNum = Number(raw);
  if (Number.isFinite(asNum) && asNum > 1_000_000_000) {
    const ms = asNum < 1e12 ? asNum * 1000 : asNum;
    return new Date(ms).toISOString();
  }
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  return new Date().toISOString();
}

export function parsePerson(raw: string | undefined): { login: string; name?: string } {
  if (!raw) return { login: "unknown" };
  const cleaned = raw.replace(/\s+/g, " ").trim();
  const angle = cleaned.match(/^(?:"?([^"<]+)"?\s*)?<([^>]+)>$/);
  if (angle) {
    const name = angle[1]?.trim();
    const email = angle[2]?.trim();
    if (email) return { login: email.slice(0, 80), name: name || undefined };
  }
  const quoted = cleaned.match(/^"([^"]+)"\s*(.*)$/);
  if (quoted) {
    return { login: (quoted[2] || quoted[1]).slice(0, 80), name: quoted[1] };
  }
  return { login: cleaned.replace(/^"|"$/g, "").slice(0, 80) };
}

function listPeople(record: Record<string, unknown>, keys: string[]): string[] {
  const out: string[] = [];
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      for (const part of value.split(/[,;]/)) {
        const person = parsePerson(part).login;
        if (person && person !== "unknown") out.push(person);
      }
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") {
          const person = parsePerson(item).login;
          if (person && person !== "unknown") out.push(person);
        } else {
          const row = asRecord(item);
          if (row) {
            const person =
              pick(row, ["email", "address", "displayName", "name", "emailAddress"]) ??
              parsePerson(pick(row, ["emailAddress"])).login;
            const nested = asRecord(row.emailAddress);
            const nestedEmail = nested ? pick(nested, ["address", "name"]) : undefined;
            const login = nestedEmail ?? person;
            if (login && login !== "unknown") out.push(login);
          }
        }
      }
    }
  }
  return [...new Set(out)];
}

function snippetOf(record: Record<string, unknown>): string | undefined {
  const direct = pick(record, ["snippet", "preview", "text", "summary", "bodyPreview", "body"]);
  if (direct) return direct.slice(0, 180);
  const body = asRecord(record.body);
  if (body) {
    const content = pick(body, ["content", "text", "plain", "data"]);
    if (content) return content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 180);
  }
  return undefined;
}

export function mapMailRows(
  data: unknown,
  extras: {
    source?: EventSource;
    direction?: CommDirection;
    idPrefix?: string;
  } = {},
): AccessEvent[] {
  const source = extras.source ?? "mail";
  const prefix = extras.idPrefix ?? source;
  const events: AccessEvent[] = [];
  for (const row of collectRows(data)) {
    const subject = pick(row, ["subject", "title", "Subject"]) ?? "(no subject)";
    const fromRaw = pick(row, ["from", "sender", "From", "fromName", "author", "organizer"]);
    const from = parsePerson(fromRaw);
    const toPeople = listPeople(row, ["to", "toRecipients", "recipients", "cc"]);
    const direction: CommDirection =
      extras.direction ??
      (pick(row, ["label", "folder", "labelIds"])?.toLowerCase().includes("sent") ? "out" : "in");
    const counterpart =
      direction === "out" ? toPeople[0] ?? from.login : from.login;
    const id =
      pick(row, ["id", "threadId", "messageId", "thread_id", "internetMessageId"]) ??
      `${from.login}-${subject}`.slice(0, 80);
    const url = pick(row, ["url", "html_url", "permalink", "link", "webLink"]);
    const at = parseDate(
      pick(row, ["date", "internalDate", "timestamp", "receivedAt", "receivedDateTime", "sentDateTime"]),
    );
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
      threadId: pick(row, ["threadId", "conversationId", "thread_id"]) ?? id,
    });
  }
  return events;
}

export function mapCalendarRows(
  data: unknown,
  extras: { source?: EventSource; idPrefix?: string } = {},
): AccessEvent[] {
  const source = extras.source ?? "calendar";
  const prefix = extras.idPrefix ?? source;
  const events: AccessEvent[] = [];
  for (const row of collectRows(data)) {
    const title = pick(row, ["summary", "title", "subject", "name"]) ?? "(untitled meeting)";
    const organizerRaw =
      pick(row, ["organizer", "creator", "organizerEmail"]) ??
      (asRecord(row.organizer)
        ? pick(asRecord(row.organizer)!, ["email", "displayName", "name"])
        : undefined);
    const organizer = parsePerson(organizerRaw);
    const attendees = listPeople(row, ["attendees", "attendee", "participants", "requiredAttendees"]);
    const startRow = asRecord(row.start);
    const at = parseDate(
      pick(row, ["start", "startTime", "start_time", "dateTime", "when"]) ??
        (startRow ? pick(startRow, ["dateTime", "date"]) : undefined),
    );
    const id = pick(row, ["id", "iCalUID", "icalUid", "eventId"]) ?? `${title}-${at}`;
    const url = pick(row, ["htmlLink", "html_url", "url", "webLink", "hangoutLink"]);
    const location = pick(row, ["location", "hangoutLink", "conferenceData"]);
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
      threadId: id,
    });
  }
  return events;
}

export function mapChatRows(
  data: unknown,
  extras: { source?: EventSource; kind?: EventKind; idPrefix?: string } = {},
): AccessEvent[] {
  const source = extras.source ?? "teams";
  const kind = extras.kind ?? "message";
  const prefix = extras.idPrefix ?? source;
  const events: AccessEvent[] = [];
  for (const row of collectRows(data)) {
    const fromRaw =
      pick(row, ["from", "sender", "author", "user", "displayName"]) ??
      (asRecord(row.from)
        ? pick(asRecord(row.from)!, ["name", "displayName", "email", "userPrincipalName"])
        : undefined) ??
      (asRecord(asRecord(row.from)?.user)
        ? pick(asRecord(asRecord(row.from)?.user)!, ["displayName", "email"])
        : undefined);
    const from = parsePerson(fromRaw);
    const body = snippetOf(row) ?? pick(row, ["content", "message", "text"]);
    const channel = pick(row, ["channel", "channelName", "chat", "chatType", "topic", "subject"]);
    const id = pick(row, ["id", "messageId", "chatId"]) ?? `${from.login}-${body ?? "msg"}`.slice(0, 80);
    const at = parseDate(
      pick(row, ["createdDateTime", "created_at", "timestamp", "date", "lastModifiedDateTime"]),
    );
    const url = pick(row, ["webUrl", "url", "link"]);
    const label = source === "teams" ? "Teams" : "Chat";
    events.push({
      id: `${prefix}-${id}`,
      at,
      kind,
      source,
      actorLogin: from.login,
      actorName: from.name,
      files: [],
      summary: body
        ? `${label}${channel ? ` · ${channel}` : ""}: ${body}`
        : `${label}${channel ? ` · ${channel}` : ""} message`,
      url,
      direction: "with",
      counterpart: from.name ?? from.login,
      subject: channel,
      threadId: pick(row, ["chatId", "channelId", "threadId"]) ?? id,
    });
  }
  return events;
}
