import { format, formatDistanceToNowStrict } from "date-fns";

export function absTime(iso: string): string {
  try {
    return format(new Date(iso), "d MMM yyyy · HH:mm");
  } catch {
    return iso;
  }
}

export function relTime(iso: string): string {
  try {
    return formatDistanceToNowStrict(new Date(iso), { addSuffix: true });
  } catch {
    return iso;
  }
}
