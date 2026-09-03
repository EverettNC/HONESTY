import type { AccessEvent } from "./types";

let directoryHandle: FileSystemDirectoryHandle | null = null;
const lastSeen = new Map<string, number>();

export function hasFolder(): boolean {
  return directoryHandle != null;
}

export function folderName(): string | null {
  return directoryHandle?.name ?? null;
}

export async function pickFolder(): Promise<string | null> {
  const picker = (
    window as Window & {
      showDirectoryPicker?: (opts?: { mode?: string }) => Promise<FileSystemDirectoryHandle>;
    }
  ).showDirectoryPicker;
  if (!picker) return null;
  directoryHandle = await picker({ mode: "read" });
  lastSeen.clear();
  return directoryHandle.name;
}

export function clearFolder() {
  directoryHandle = null;
  lastSeen.clear();
}

type Walked = { path: string; modified: number };

async function walk(
  handle: FileSystemDirectoryHandle,
  prefix: string,
  depth: number,
  out: Walked[],
): Promise<void> {
  if (out.length > 400 || depth > 4) return;
  const entries = (
    handle as FileSystemDirectoryHandle & {
      values: () => AsyncIterable<FileSystemHandle>;
    }
  ).values();
  for await (const entry of entries) {
    if (out.length > 400) return;
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.kind === "file") {
      const fileHandle = entry as FileSystemFileHandle;
      const file = await fileHandle.getFile();
      out.push({ path, modified: file.lastModified });
    } else if (entry.kind === "directory") {
      await walk(entry as FileSystemDirectoryHandle, path, depth + 1, out);
    }
  }
}

export async function scanFolder(actorLogin: string): Promise<AccessEvent[]> {
  if (!directoryHandle) return [];
  const walked: Walked[] = [];
  try {
    await walk(directoryHandle, directoryHandle.name, 0, walked);
  } catch {
    return [];
  }

  const now = new Date().toISOString();
  const events: AccessEvent[] = [];
  const isFirst = lastSeen.size === 0;

  for (const item of walked) {
    const prior = lastSeen.get(item.path);
    lastSeen.set(item.path, item.modified);
    if (isFirst || prior === undefined) continue;
    if (item.modified === prior) continue;
    events.push({
      id: `home-${item.path}-${item.modified}`,
      at: now,
      kind: "modify",
      source: "home",
      actorLogin,
      files: [item.path],
      summary: `Modified ${item.path} on the attached folder`,
    });
  }

  if (isFirst) {
    events.push({
      id: `home-attach-${Date.now()}`,
      at: now,
      kind: "open",
      source: "home",
      actorLogin,
      files: walked.slice(0, 12).map((item) => item.path),
      summary: `Attached folder ${directoryHandle.name} · ${walked.length} files in view`,
    });
  }

  return events;
}

export function canPickFolder(): boolean {
  return typeof window !== "undefined" && "showDirectoryPicker" in window;
}
