import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as faPpm, f as labelMonth, i as faPct, o as useQuality, r as faNum } from "./router-D4xy10yw.mjs";
import { i as useView, n as Kpi, r as Panel } from "./use-view-B4-U4jT9.mjs";
import { r as TrendChart } from "./charts-Nigq-uku.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CnGuJH8x.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const view = useView();
	const windowMonths = useQuality((s) => s.filters.windowMonths);
	const earlyDays = useQuality((s) => s.dataset.meta.earlyDays);
	const tied = view.topCause ? view.byCause.filter((row) => row.n === view.topCause?.n && row.n > 0) : [];
	const monthRows = view.byMonth.map((row) => ({
		label: row.label.replace(/ \d{4}$/, ""),
		returns: row.returns,
		ppm: row.ppm === null ? null : Math.round(row.ppm),
		installs: row.installs
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-w-0 gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "نمای مدیریت"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "هدف : تحلیل و شناسایی علت برگشت محصولات و کاهش آمار"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "PPM تجمیعی",
						value: faPpm(view.ppm),
						hint: view.window ? `صورت ${faNum(view.numerator.length)} · مخرج ${faNum(view.denominator)} · پنجره ${labelMonth(view.window.start)} تا ${labelMonth(view.window.end)}` : "ماهی در فیلتر نمانده است"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "تعداد برگشتی",
						value: faNum(view.numerator.length),
						hint: "ردیف دارای تاریخ برگشت معتبر در ماه‌های انتخاب‌شده"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "نصب پنجره",
						value: faNum(view.denominator),
						hint: "سریال یکتا، به‌علاوه ردیف بی‌سریال که حذف نشده"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "نرخ خرابی زودهنگام",
						value: faPct(view.early.rate),
						hint: `${faNum(view.early.yes)} از ${faNum(view.early.yes + view.early.no)} ردیف با عمر معلوم · تعریف: تا ${faNum(earlyDays)} روز · ${faNum(view.early.unknown)} نامشخص کنار نرخ، نه حذف`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "نرخ خرابی تکراری",
						value: faPct(view.repeat.rate),
						hint: `${faNum(view.repeat.events)} رخداد روی ${faNum(view.repeat.serials)} سریال · از ${faNum(view.repeat.eligible)} سریال‌دار`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "سهم منشأ مونتاژ و کنترل کیفیت",
						value: faPct(view.assembly.rate),
						hint: `${faNum(view.assembly.count)} ردیف از صورت همین فیلتر`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "مهم‌ترین علت",
						value: tied.length > 1 ? `${faNum(tied.length)} علت هم‌رتبه` : view.topCause?.name ?? "—",
						hint: tied.length ? tied.map((row) => `${row.name} (${faNum(row.n)})`).join(" · ") : "علتی در صورت کسر نیست"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "بحرانی‌ترین مدل",
						value: view.criticalModel?.model ?? "قابل اعلام نیست",
						hint: view.criticalModel ? `${view.criticalModel.family} · ${faNum(view.criticalModel.n)} برگشت / ${faNum(view.criticalModel.installs)} نصب · PPM ${faPpm(view.criticalModel.ppm)}` : "مدلی با پایه نصب در این پنجره پیدا نشد"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "پرتکرارترین قطعه",
						value: view.topPart ? `${view.topPart.name}` : "در اقدام‌ها قطعه نیست",
						hint: view.topPart ? `${view.topPart.kind} · ${faNum(view.topPart.n)} مورد` : "از متن اقدامات استخراج می‌شود"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "جمع‌بندی",
						hint: "از روی همین فیلتر، بدون حدس آستانه.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "grid gap-2 text-sm leading-6",
							children: view.narrative.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "rounded-xl bg-paper px-3 py-2",
								children: line
							}, line))
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "اولویت اقدام اصلاحی",
						hint: "امتیاز = ۴۰٪ تعداد + ۲۵٪ PPM علت + ۱۵٪ سهم زودهنگام + ۱۰٪ سهم تکرار + ۱۰٪ روند. تاریخ اقدام اصلاحی در داده نیست.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "grid gap-2",
							children: [view.priorities.slice(0, 6).map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-xl bg-paper px-3 py-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-baseline justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-medium",
											children: [
												faNum(index + 1),
												". ",
												row.name
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm text-muted",
											children: ["امتیاز ", faNum(row.score, 1)]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-sm text-muted",
										children: [
											faNum(row.n),
											" مورد · PPM ",
											faPpm(row.ppm),
											" · روند ",
											row.trend,
											" · زودهنگام ",
											faPct(row.earlyShare),
											" · تکرار ",
											faPct(row.repeatShare)
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted",
										children: [
											"مدل: ",
											row.models.slice(0, 4).join("، ") || "—",
											" · قطعه: ",
											row.parts.slice(0, 3).join("، ") || "ذکر نشده",
											" · منشأ:",
											" ",
											row.origins.join("، ")
										]
									})
								]
							}, row.name)), !view.priorities.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-sm text-muted",
								children: "با این فیلتر برگشتیِ تاریخ‌دار نیست."
							}) : null]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "روند ماهانه",
				hint: `ستون، تعداد برگشت همان ماه است. خط، PPM همان ماه با پنجره ${faNum(windowMonths)} ماهه خودش است، نه PPM تجمیعی بالا.`,
				children: monthRows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendChart, { rows: monthRows }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "ماهی برای نمودار نمانده است."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "ردیابی صورت و مخرج هر ماه",
				hint: "برای چند ماه با هم، PPM بالای صفحه یک پنجره پیوسته از ابتدای پنجره اولین ماه تا آخرین ماه است. جدول زیر فرمول هر ماه را جدا نشان می‌دهد.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[40rem] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-line text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium",
									children: "ماه برگشت"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium",
									children: "صورت"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium",
									children: "شروع مخرج"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium",
									children: "پایان مخرج"
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
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: view.byMonth.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-line",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: row.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: faNum(row.returns)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: labelMonth(row.windowStart)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: labelMonth(row.windowEnd)
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
						}, row.month)) })]
					})
				})
			})
		]
	});
}
//#endregion
export { Home as component };
