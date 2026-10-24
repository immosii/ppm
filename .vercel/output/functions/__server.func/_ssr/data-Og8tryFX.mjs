import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as appendInstalls, i as faPct, l as replaceReturns, o as useQuality, r as faNum, u as sheetKind } from "./router-D4xy10yw.mjs";
import { i as useView, r as Panel, t as EmptyNote } from "./use-view-B4-U4jT9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data-Og8tryFX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function ingestWorkbook(file, dataset) {
	const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
	const book = XLSX.read(await file.arrayBuffer(), { type: "array" });
	const name = book.SheetNames[0];
	if (!name) throw new Error("برگه‌ای در فایل نیست.");
	const rows = XLSX.utils.sheet_to_json(book.Sheets[name], {
		defval: "",
		raw: false
	});
	if (!rows.length) throw new Error("این فایل ردیف داده ندارد.");
	const kind = sheetKind(Object.keys(rows[0] ?? {}));
	if (kind === "returns") {
		const next = replaceReturns(dataset, rows, file.name);
		return {
			dataset: next,
			message: `فایل برگشتی جایگزین شد. ${next.returns.length.toLocaleString("fa-IR")} ردیف خوانده شد و ردیف‌های نامعتبر حذف نشدند.`
		};
	}
	if (kind === "installs") {
		const before = dataset.installAudit.population;
		const next = appendInstalls(dataset, rows, file.name);
		return {
			dataset: next,
			message: `فایل نصب به مخرج اضافه شد. جمعیت از ${before.toLocaleString("fa-IR")} به ${next.installAudit.population.toLocaleString("fa-IR")} رسید. سریال‌هایی که از قبل بودند دوباره شمرده نشدند.`
		};
	}
	throw new Error("سرستون‌ها نه برگشتی است و نه نصب. ستون علت یا مدل/سریال/تاریخ نصب لازم است.");
}
function DataPage() {
	const dataset = useQuality((s) => s.dataset);
	const setDataset = useQuality((s) => s.setDataset);
	const view = useView();
	const audit = dataset.installAudit;
	const [message, setMessage] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onFiles(list) {
		if (!list?.length) return;
		setBusy(true);
		setError("");
		setMessage("");
		let current = useQuality.getState().dataset;
		const notes = [];
		try {
			for (const file of list) {
				const result = await ingestWorkbook(file, current);
				current = result.dataset;
				notes.push(result.message);
			}
			setDataset(current);
			setMessage(notes.join(" "));
		} catch (err) {
			setError(err instanceof Error ? err.message : "خواندن فایل ممکن نشد.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-w-0 gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "کنترل داده"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "کامل بودن، تاریخ‌های ناسازگار و منبع مخرج. ردیف مشکوک حذف نمی‌شود."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "به‌روزرسانی با اکسل",
				hint: "برگشتی، صورت را جایگزین می‌کند و به همین ایندکس سریال نصب وصل می‌شود. نصب، فقط سریال تازه را به مخرج اضافه می‌کند.",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-paper px-4 py-6 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: busy ? "در حال خواندن…" : "فایل xlsx را انتخاب کنید"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 text-sm text-muted",
								children: "می‌شود چند فایل را با هم داد"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: ".xlsx,.xls",
								multiple: true,
								className: "sr-only",
								disabled: busy,
								onChange: (event) => {
									onFiles(event.target.files);
									event.target.value = "";
								}
							})
						]
					}),
					message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm",
						children: message
					}) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-clay",
						children: error
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "کامل بودن فیلدهای برگشتی",
					hint: `روی کل ${faNum(dataset.returns.length)} ردیف برگشتی، نه فقط فیلتر فعلی.`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-2xl font-semibold",
						children: faPct(view.completeness)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-2",
						children: view.fieldFill.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: field.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [
									faNum(field.filled),
									" / ",
									faNum(field.total)
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 rounded-full bg-paper",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2 rounded-full bg-pine",
								style: { width: `${field.rate * 100}%` }
							})
						})] }, field.label))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "پرچم‌های کیفیت داده",
					children: view.issueCounts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-2 text-sm",
						children: view.issueCounts.map((issue) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-3 rounded-xl bg-paper px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: issue.flag }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: faNum(issue.n)
							})]
						}, issue.flag))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyNote, { children: "پرچمی ثبت نشده." })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "ممیزی نصب",
				hint: "مخرج از این جمعیت ساخته می‌شود.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "grid gap-2 sm:grid-cols-2",
					children: [
						["ردیف خوانده‌شده", audit.rows],
						["تاریخ نامعتبر", audit.invalidDate],
						["بدون سریال، شمرده‌شده", audit.anonymousRows],
						["سریال یکتا", audit.distinctSerials],
						["تکراریِ کنارگذاشته از مخرج", audit.duplicateRowsExcluded],
						["جمعیت مخرج", audit.population],
						["بدون مدل", audit.missingModel],
						["نصب قبل از تولید", audit.installBeforeProduction]
					].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl bg-paper px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-medium",
							children: faNum(Number(value))
						})]
					}, String(label)))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "هزینه",
				children: [view.cost ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: [
						"جمع هزینه ردیف‌های دارای عدد در این فیلتر ",
						faNum(view.cost.total),
						" است، روی ",
						faNum(view.cost.rows),
						" ردیف."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyNote, { children: "ستون هزینه در فایل برگشتی نیست. عددی ساخته نشده است." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: view.hasCaDate ? "حداقل یک تاریخ اقدام اصلاحی در داده هست." : "تاریخ اقدام اصلاحی در فایل نیست، پس پیگیری زمان اقدام نمایش داده نمی‌شود."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "منطق و منابع",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-2 text-sm leading-6",
						children: dataset.meta.notes.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-xl bg-paper px-3 py-2",
							children: note
						}, note))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-muted",
						children: ["منابع: ", dataset.meta.sources.join(" · ")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"تعریف زودهنگام: عمر برگشت تا ",
							faNum(dataset.meta.earlyDays),
							" روز. پنجره پیش‌فرض ",
							faNum(dataset.meta.windowDefault),
							" ماه."
						]
					})
				]
			})
		]
	});
}
//#endregion
export { DataPage as component };
