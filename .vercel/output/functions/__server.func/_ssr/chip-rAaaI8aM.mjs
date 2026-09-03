import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn } from "./router-BiTPZ2ht.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chip-rAaaI8aM.js
var import_jsx_runtime = require_jsx_runtime();
function Chip({ active, className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("inline-flex min-h-11 items-center justify-center rounded-sm px-3 text-sm transition-[background-color,color] duration-quick ease-out", active ? "bg-accent text-accent-fg" : "text-muted hover:bg-surface-2 hover:text-fg", className),
		...props
	});
}
//#endregion
export { Chip as t };
