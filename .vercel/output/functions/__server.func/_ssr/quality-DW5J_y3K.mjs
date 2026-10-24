import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as faPpm, d as AGE_ORDER, i as faPct, r as faNum } from "./router-D4xy10yw.mjs";
import { i as useView, r as Panel, t as EmptyNote } from "./use-view-B4-U4jT9.mjs";
import { n as ParetoChart, t as HBars } from "./charts-Nigq-uku.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quality-DW5J_y3K.js
var import_jsx_runtime = require_jsx_runtime();
function QualityPage() {
	const view = useView();
	const ages = AGE_ORDER.map((name) => view.byAge.find((row) => row.name === name)).filter((row) => row && row.n > 0);
	const families = [...new Set(view.causeFamily.map((cell) => cell.b))];
	const causes = view.byCause.slice(0, 8);
	const maxCell = Math.max(1, ...view.causeFamily.map((cell) => cell.n));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-w-0 gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "تحلیل کیفیت"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "علت، منشأ، عمر، مدل و قطعه. ردیف «فاقد ایراد» حذف نشده چون در فایل هست."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "پارتو علت",
				hint: "خط تجمعی فقط برای دیدن تمرکز است. عدد ۸۰ هدف کیفی نیست و در داده تعریف نشده.",
				children: view.byCause.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParetoChart, { rows: view.byCause.slice(0, 12).map((row) => ({
					name: row.name,
					n: row.n,
					cum: row.cum
				})) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 min-w-0 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[36rem] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-line text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium",
									children: "علت"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium",
									children: "تعداد"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium",
									children: "سهم"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium",
									children: "تجمعی"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium",
									children: "PPM"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: view.byCause.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-line",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: row.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: faNum(row.n)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: faPct(row.share)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: faPct(row.cum)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: faPpm(row.ppm)
								})
							]
						}, row.name)) })]
					})
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyNote, { children: "علتی در این فیلتر نیست." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "منشأ خرابی",
					hint: "از ستون ریشه احتمالی نرمال شده. مقدار نامشخص حذف نشده.",
					children: view.byOrigin.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HBars, { rows: view.byOrigin }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyNote, { children: "منشائی نیست." })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "ریشه احتمالی",
					children: view.byRoot.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HBars, { rows: view.byRoot }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyNote, { children: "ریشه‌ای نیست." })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "عمر تا برگشت",
					hint: "فاصله تاریخ برگشت تا تاریخ نصب. سطل‌های خالی نشان داده نمی‌شوند چون تعدادشان صفر است، نه چون حذف شده‌اند.",
					children: ages.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HBars, { rows: ages }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyNote, { children: "عمر قابل نمایش نیست." })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "قطعه در متن اقدام",
					children: view.byPart.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-line text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2 py-2 text-right font-medium",
										children: "قطعه"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2 py-2 text-right font-medium",
										children: "نوع"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2 py-2 text-right font-medium",
										children: "تعداد"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: view.byPart.slice(0, 12).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-line",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-2",
										children: row.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-2",
										children: row.kind
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-2",
										children: faNum(row.n)
									})
								]
							}, `${row.kind}-${row.name}`)) })]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyNote, { children: "در اقدامات این فیلتر قطعه‌ای استخراج نشد." })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "مدل‌ها",
				hint: "مرتب بر PPM. اگر نصب پنجره صفر باشد PPM اعلام نمی‌شود. پایه کوچک را کنار تعداد بخوانید.",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[40rem] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-line text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium",
									children: "مدل"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium",
									children: "خانواده"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium",
									children: "برگشت"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium",
									children: "نصب پنجره"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium",
									children: "PPM"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: view.byModel.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-line",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: row.model
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: row.family
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: faNum(row.n)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: faNum(row.installs)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: faPpm(row.ppm)
								})
							]
						}, `${row.family}-${row.model}`)) })]
					})
				}), view.modelsWithoutBase.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-muted",
					children: ["بدون پایه نصب: ", view.modelsWithoutBase.map((row) => row.model).join("، ")]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "خانواده محصول",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-line text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium",
									children: "خانواده"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium",
									children: "برگشت"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium",
									children: "نصب"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium",
									children: "PPM"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: view.byFamily.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-line",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: row.family
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: faNum(row.n)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: faNum(row.installs)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: faPpm(row.ppm)
								})
							]
						}, row.family)) })]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "علت در خانواده",
				hint: "هشت علت پرتعداد. بقیه علت‌ها در جدول پارتو هستند.",
				children: causes.length && families.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[36rem] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-line text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2 text-right font-medium",
								children: "علت"
							}), families.map((family) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2 text-right font-medium",
								children: family
							}, family))]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: causes.map((cause) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-line",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-2",
								children: cause.name
							}), families.map((family) => {
								const n = view.causeFamily.find((cell) => cell.a === cause.name && cell.b === family)?.n ?? 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex min-w-8 justify-center rounded-lg px-2 py-1",
										style: { background: `color-mix(in srgb, var(--color-pine) ${Math.round(n / maxCell * 100)}%, var(--color-paper))` },
										children: n ? faNum(n) : "—"
									})
								}, family);
							})]
						}, cause.name)) })]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyNote, { children: "ماتریسی ساخته نشد." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountPanel, {
						title: "نتیجه خدمت",
						rows: tally(view.numerator, (row) => row.serviceResult)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountPanel, {
						title: "گرید اولیه",
						rows: tally(view.numerator, (row) => row.gradeInitial)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountPanel, {
						title: "گرید نهایی",
						rows: tally(view.numerator, (row) => row.gradeFinal)
					})
				]
			})
		]
	});
}
function tally(rows, pick) {
	const map = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const key = pick(row) || "نامشخص";
		map.set(key, (map.get(key) ?? 0) + 1);
	}
	return [...map.entries()].map(([name, n]) => ({
		name,
		n
	})).sort((a, b) => b.n - a.n);
}
function CountPanel({ title, rows }) {
	const total = rows.reduce((sum, row) => sum + row.n, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		title,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "grid gap-2",
			children: [rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex justify-between text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted",
					children: [
						faNum(row.n),
						" · ",
						faPct(total ? row.n / total : 0)
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-2 rounded-full bg-paper",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2 rounded-full bg-pine",
					style: { width: `${total ? row.n / total * 100 : 0}%` }
				})
			})] }, row.name)), !rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "text-sm text-muted",
				children: "ردیفی نیست."
			}) : null]
		})
	});
}
//#endregion
export { QualityPage as component };
