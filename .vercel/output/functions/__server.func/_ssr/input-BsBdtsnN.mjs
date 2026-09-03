import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn } from "./router-BiTPZ2ht.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-BsBdtsnN.js
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm text-fg placeholder:text-subtle outline-none transition-[border-color] duration-quick ease-out focus:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-28 w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-fg placeholder:text-subtle outline-none transition-[border-color] duration-quick ease-out focus:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent", className),
		...props
	});
}
//#endregion
export { Textarea as n, Input as t };
