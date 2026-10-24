import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as faDate, r as faNum } from "./router-D4xy10yw.mjs";
import { i as useView, r as Panel, t as EmptyNote } from "./use-view-B4-U4jT9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/records-yyHuk3_-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAGE = 12;
function RecordsPage() {
	const view = useView();
	const [q, setQ] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(0);
	const filtered = (0, import_react.useMemo)(() => {
		const query = q.trim();
		if (!query) return view.numerator;
		return view.numerator.filter((row) => [
			row.serial,
			row.model,
			row.family,
			row.cause,
			row.root,
			row.origin,
			row.description,
			row.action,
			row.warehouse
		].join(" ").includes(query));
	}, [q, view.numerator]);
	const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
	const safePage = Math.min(page, pages - 1);
	const slice = filtered.slice(safePage * PAGE, safePage * PAGE + PAGE);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-w-0 gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "ریز رکوردها"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "همان ردیف‌هایی که در صورت کسر این فیلتر هستند. چیزی به‌خاطر نامشخص بودن حذف نشده."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: `${faNum(filtered.length)} ردیف تاریخ‌دار`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (event) => {
							setQ(event.target.value);
							setPage(0);
						},
						placeholder: "سریال، مدل، علت، شرح",
						className: "mb-3 h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm"
					}),
					slice.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordTable, { rows: slice }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyNote, { children: "ردیفی با این جستجو نیست." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center justify-between text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 rounded-full border border-line px-4 disabled:text-muted",
								disabled: safePage === 0,
								onClick: () => setPage(safePage - 1),
								children: "قبلی"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [
									faNum(safePage + 1),
									" از ",
									faNum(pages)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 rounded-full border border-line px-4 disabled:text-muted",
								disabled: safePage >= pages - 1,
								onClick: () => setPage(safePage + 1),
								children: "بعدی"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "بدون تاریخ برگشت معتبر",
				hint: "داخل صورت ماهانه نیستند، ولی از فایل حذف نشده‌اند.",
				children: view.undatedRows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordTable, { rows: view.undatedRows }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyNote, { children: "در این فیلتر ردیف بدون تاریخ برگشت نیست." })
			})
		]
	});
}
function RecordTable({ rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-w-0 overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[64rem] text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "border-b border-line text-muted",
				children: [
					"سریال",
					"مدل",
					"خانواده",
					"برگشت",
					"نصب",
					"عمر",
					"علت",
					"منشأ",
					"ریشه",
					"اقدام",
					"قطعه",
					"گرید",
					"پرچم"
				].map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-2 py-2 text-right font-medium whitespace-nowrap",
					children: label
				}, label))
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-line align-top",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2 py-2 whitespace-nowrap",
						children: row.serial || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2 py-2 whitespace-nowrap",
						children: row.model
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2 py-2 whitespace-nowrap",
						children: row.family
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2 py-2 whitespace-nowrap",
						children: faDate(row.returnDate)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2 py-2 whitespace-nowrap",
						children: faDate(row.installDate)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2 py-2 whitespace-nowrap",
						children: row.ageDays === null ? row.ageBucket : `${faNum(row.ageDays)} روز`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2 py-2",
						children: row.cause
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2 py-2 whitespace-nowrap",
						children: row.origin
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2 py-2",
						children: row.root
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2 py-2 min-w-48",
						children: row.action || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2 py-2",
						children: row.parts.map((part) => part.name).join("، ") || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: "px-2 py-2 whitespace-nowrap",
						children: [
							row.gradeInitial,
							" ← ",
							row.gradeFinal
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2 py-2 min-w-40 text-xs text-muted",
						children: row.flags.join(" · ") || "—"
					})
				]
			}, row.id)) })]
		})
	});
}
//#endregion
export { RecordsPage as component };
