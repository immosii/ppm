import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as faNum } from "./router-D4xy10yw.mjs";
import { a as Line, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as BarChart, o as CartesianGrid, r as YAxis, s as Bar, t as ComposedChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/charts-Nigq-uku.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useMounted() {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	return mounted;
}
function Frame({ height, children }) {
	if (!useMounted()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl bg-pine-soft",
		style: { height }
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full max-w-full overflow-hidden",
		style: { height },
		dir: "ltr",
		children
	});
}
function Tip({ active, payload, label }) {
	if (!active || !payload?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line bg-sand px-3 py-2 text-sm text-ink shadow-sm",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-semibold",
			children: label
		}), payload.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-muted",
			children: [
				item.name,
				": ",
				faNum(Number(item.value))
			]
		}, String(item.name)))]
	});
}
var tick = {
	fill: "var(--color-muted)",
	fontSize: 12
};
function TrendChart({ rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Frame, {
		height: 280,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
				data: rows,
				margin: {
					top: 8,
					right: 8,
					left: 0,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						stroke: "var(--color-line)",
						vertical: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "label",
						tick
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						yAxisId: "n",
						tick,
						allowDecimals: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						yAxisId: "p",
						orientation: "right",
						tick
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tip, {}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
						yAxisId: "n",
						dataKey: "returns",
						name: "برگشتی",
						fill: "var(--color-pine)",
						radius: [
							6,
							6,
							0,
							0
						],
						barSize: 22
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						yAxisId: "p",
						dataKey: "ppm",
						name: "PPM",
						stroke: "var(--color-clay)",
						strokeWidth: 2,
						dot: { r: 3 },
						connectNulls: false
					})
				]
			})
		})
	});
}
function ParetoChart({ rows }) {
	const data = rows.map((row) => ({
		name: row.name.length > 16 ? `${row.name.slice(0, 15)}…` : row.name,
		full: row.name,
		n: row.n,
		cum: Math.round(row.cum * 100)
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Frame, {
		height: 300,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
				data,
				margin: {
					top: 8,
					right: 8,
					left: 0,
					bottom: 24
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						stroke: "var(--color-line)",
						vertical: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "name",
						tick,
						interval: 0,
						angle: -25,
						textAnchor: "end",
						height: 60
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						yAxisId: "n",
						tick,
						allowDecimals: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						yAxisId: "c",
						orientation: "right",
						tick,
						domain: [0, 100]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tip, {}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
						yAxisId: "n",
						dataKey: "n",
						name: "تعداد",
						fill: "var(--color-pine)",
						radius: [
							6,
							6,
							0,
							0
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						yAxisId: "c",
						dataKey: "cum",
						name: "تجمعی٪",
						stroke: "var(--color-clay)",
						strokeWidth: 2,
						dot: false
					})
				]
			})
		})
	});
}
function HBars({ rows }) {
	const data = rows.slice(0, 10).map((row) => ({
		name: row.name.length > 18 ? `${row.name.slice(0, 17)}…` : row.name,
		n: row.n
	}));
	const height = Math.max(200, data.length * 36);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Frame, {
		height,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
				data,
				layout: "vertical",
				margin: {
					top: 4,
					right: 12,
					left: 8,
					bottom: 4
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						type: "number",
						hide: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						type: "category",
						dataKey: "name",
						width: 120,
						tick
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tip, {}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
						dataKey: "n",
						name: "تعداد",
						fill: "var(--color-pine)",
						radius: [
							0,
							6,
							6,
							0
						],
						barSize: 14
					})
				]
			})
		})
	});
}
//#endregion
export { ParetoChart as n, TrendChart as r, HBars as t };
