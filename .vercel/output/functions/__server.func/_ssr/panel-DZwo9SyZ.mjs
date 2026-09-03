import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn } from "./router-BiTPZ2ht.mjs";
import { n as format, t as formatDistanceToNowStrict } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/panel-DZwo9SyZ.js
var import_jsx_runtime = require_jsx_runtime();
function absTime(iso) {
	try {
		return format(new Date(iso), "d MMM yyyy · HH:mm");
	} catch {
		return iso;
	}
}
function relTime(iso) {
	try {
		return formatDistanceToNowStrict(new Date(iso), { addSuffix: true });
	} catch {
		return iso;
	}
}
function Badge({ className, tone = "muted", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium tracking-wide", {
			muted: "bg-surface-2 text-muted border-border",
			sage: "bg-sage/15 text-sage border-sage/30",
			danger: "bg-danger/15 text-danger border-danger/30",
			paper: "bg-accent/10 text-fg border-border"
		}[tone], className),
		...props
	});
}
function PageHeader({ kicker, title, children, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "kicker",
		children: kicker
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl text-fg",
				children: title
			}), children ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 text-sm text-muted",
				children
			}) : null]
		}), actions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap items-center gap-3",
			children: actions
		}) : null]
	})] });
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium select-none transition-[opacity,transform,background-color,color,border-color] duration-quick ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-95", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "border border-border bg-surface text-fg hover:bg-surface-2 hover:border-border-strong",
			ghost: "text-fg hover:bg-surface-2",
			danger: "bg-danger text-paper hover:opacity-90"
		},
		size: {
			sm: "h-11 px-3 text-sm rounded-sm",
			md: "h-11 px-4 text-sm rounded-md",
			lg: "h-12 px-5 text-base rounded-md"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Panel({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cn("rounded-2xl border border-border bg-surface p-5", className),
		...props
	});
}
//#endregion
export { absTime as a, Panel as i, Button as n, relTime as o, PageHeader as r, Badge as t };
