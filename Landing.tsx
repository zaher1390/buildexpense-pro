import { useState } from 'react';
import {
  Building2, Wallet, TrendingUp, Scale, Coins, Calculator,
  ArrowLeft, CheckCircle2, Sparkles, ShieldCheck, Clock, Landmark,
} from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

const NAVY = '#0B1F3B';
const GOLD = '#B38A3B';

const features = [
  { icon: Wallet, title: 'إدارة المصروفات', desc: 'سجّل كل معاملة بتفاصيلها الكاملة وصنّفها في ثوانٍ' },
  { icon: TrendingUp, title: 'تقارير ذكية', desc: 'لوحات تحليلية مباشرة توضح أين يذهب كل ريال في مشروعك' },
  { icon: Calculator, title: 'حساب تكلفة المتر', desc: 'احسب تكلفة المتر المربع تلقائياً وتابع انحرافاتها لحظة بلحظة' },
  { icon: Coins, title: 'دعم العملات', desc: 'ريال سعودي، درهم، دينار، ودولار — مع تحويل تلقائي بين العملات' },
  { icon: Scale, title: 'نظام محاسبي', desc: 'فئات رئيسية وفرعية قابلة للتخصيص تناسب طبيعة مشاريع البناء' },
  { icon: ShieldCheck, title: 'بيانات آمنة', desc: 'تشفير كامل وحماية متقدمة لبياناتك المالية على مدار الساعة' },
];

const steps = [
  { n: '01', title: 'أضف مصروفاتك', desc: 'أدخل المعاملات بسهولة عبر واجهة بسيطة ومنظمة' },
  { n: '02', title: 'تابع التقارير', desc: 'احصل على رؤية كاملة وتحليلات فورية لمشروعك' },
  { n: '03', title: 'تحكم في ميزانيتك', desc: 'قرارات أذكى، توفير أعلى، وسيطرة كاملة على التكاليف' },
];

const plans = [
  {
    id: 'free',
    name: 'المجاني',
    price: 0,
    tagline: 'ابدأ بدون تكلفة',
    features: ['حتى 20 معاملة', 'لوحة تحكم مالية', 'تتبع الفئات الأساسية'],
    cta: 'ابدأ مجاناً',
  },
  {
    id: 'pro',
    name: 'الاحترافي',
    price: 99,
    tagline: 'الأكثر شعبية',
    highlight: true,
    features: ['معاملات غير محدودة', 'جميع الفئات والأنواع', 'تعدد العملات', 'دعم فني سريع'],
    cta: 'ابدأ مشروعك الآن',
  },
  {
    id: 'business',
    name: 'الأعمال',
    price: 299,
    tagline: 'للمقاولين والشركات',
    features: ['كل مزايا الاحترافي', 'تقارير متقدمة', 'تصدير البيانات', 'مستخدمون متعددون'],
    cta: 'ابدأ مشروعك الآن',
  },
];

export default function Landing({ onStart }: LandingProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-white text-[#0B1F3B] font-dubai overflow-x-hidden">
      {/* NAV */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: NAVY }}>
              <Building2 size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-[15px]">BuildExpense Pro</div>
              <div className="text-[10px] text-gray-400">إدارة مصاريف البناء</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm text-gray-600">
            <a href="#features" className="hover:text-[#0B1F3B] transition-colors">المميزات</a>
            <a href="#how" className="hover:text-[#0B1F3B] transition-colors">كيف يعمل</a>
            <a href="#pricing" className="hover:text-[#0B1F3B] transition-colors">الأسعار</a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={onStart}
              className="hidden sm:inline-flex items-center gap-1.5 text-white text-sm font-bold px-4 h-10 rounded-xl hover:opacity-90 transition"
              style={{ background: NAVY }}
            >
              ابدأ الآن
              <ArrowLeft size={15} />
            </button>
            <button onClick={() => setMobileOpen(v => !v)} className="md:hidden w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center">
              <span className="sr-only">menu</span>
              <div className="space-y-1">
                <span className="block w-4 h-0.5 bg-[#0B1F3B]" />
                <span className="block w-4 h-0.5 bg-[#0B1F3B]" />
                <span className="block w-4 h-0.5 bg-[#0B1F3B]" />
              </div>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-5 py-3 flex flex-col gap-3 text-sm">
              <a onClick={() => setMobileOpen(false)} href="#features">المميزات</a>
              <a onClick={() => setMobileOpen(false)} href="#how">كيف يعمل</a>
              <a onClick={() => setMobileOpen(false)} href="#pricing">الأسعار</a>
              <button onClick={onStart} className="text-white font-bold py-2.5 rounded-xl" style={{ background: NAVY }}>ابدأ الآن</button>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{
          background: `radial-gradient(1100px 500px at 85% -10%, rgba(179,138,59,0.12), transparent 60%), radial-gradient(900px 500px at 10% 10%, rgba(11,31,59,0.06), transparent 60%)`,
        }} />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-20 md:pt-24 md:pb-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#B38A3B]/10 text-[#B38A3B] px-3 py-1.5 rounded-full text-xs font-bold mb-6">
              <Sparkles size={13} />
              الحل الأذكى لمقاولي ومالكي مشاريع البناء
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight mb-6">
              تحكم كامل في مصاريف
              <br />
              <span className="relative inline-block">
                <span style={{ color: GOLD }}>مشروع البناء</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10" fill="none" preserveAspectRatio="none">
                  <path d="M2 8 Q 100 -2 198 8" stroke={GOLD} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
                </svg>
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
              نظام ذكي يساعدك تتابع كل ريال بدقة — من تكلفة المواد وحتى أجور المقاولين، في لوحة واحدة واضحة وسهلة.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={onStart}
                className="group inline-flex items-center gap-2 text-white font-bold px-7 h-14 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #9a7530)` }}
              >
                ابدأ الآن
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <a
                href="#features"
                className="inline-flex items-center gap-2 font-bold px-7 h-14 rounded-2xl border border-gray-200 hover:border-[#0B1F3B] transition"
              >
                اكتشف المميزات
              </a>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#B38A3B]" /> بدون بطاقة ائتمان</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#B38A3B]" /> إعداد في أقل من دقيقة</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#B38A3B]" /> دعم باللغة العربية</div>
            </div>
          </div>

          {/* Visual preview card */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl" style={{ background: `linear-gradient(135deg, ${GOLD}, ${NAVY})` }} />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
              <div className="p-5 pb-4" style={{ background: NAVY }}>
                <div className="flex items-center justify-between text-white mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Building2 size={15} />
                    </div>
                    <div>
                      <div className="text-[11px] text-white/60">إجمالي الميزانية</div>
                      <div className="font-bold text-sm">1,200,000 ر.س</div>
                    </div>
                  </div>
                  <div className="text-[10px] bg-[#B38A3B] text-white px-2 py-1 rounded font-bold">مباشر</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'المصروفات', v: '845K', c: '#ef4444' },
                    { label: 'المتبقي', v: '355K', c: '#10b981' },
                    { label: 'م²', v: '2,815', c: GOLD },
                  ].map(s => (
                    <div key={s.label} className="bg-white/10 rounded-lg p-2">
                      <div className="text-[9px] text-white/60">{s.label}</div>
                      <div className="text-[13px] font-bold text-white">{s.v}</div>
                      <div className="h-0.5 mt-1 rounded-full" style={{ background: s.c, width: '70%' }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { t: 'حديد تسليح', cat: 'مواد', a: '45,200', p: 82 },
                  { t: 'عمالة - صبة خرسانية', cat: 'مقاولات', a: '28,900', p: 64 },
                  { t: 'كهرباء', cat: 'خدمات', a: '12,400', p: 38 },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${GOLD}15`, color: GOLD }}>
                      <Wallet size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-[13px] truncate">{r.t}</div>
                        <div className="text-[13px] font-bold" style={{ color: NAVY }}>{r.a}</div>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-[10px] text-gray-400">{r.cat}</div>
                        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ background: GOLD, width: `${r.p}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-2 text-center text-[10px] text-gray-400">لوحة تحكم حقيقية من داخل التطبيق</div>
              </div>
            </div>
            {/* Floating badges */}
            <div className="hidden sm:flex absolute -top-4 -left-4 bg-white shadow-lg rounded-xl px-3 py-2 items-center gap-2 border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><TrendingUp size={14} className="text-emerald-600" /></div>
              <div>
                <div className="text-[10px] text-gray-400">توفير</div>
                <div className="text-xs font-bold text-emerald-600">+12%</div>
              </div>
            </div>
            <div className="hidden sm:flex absolute -bottom-4 -right-4 bg-white shadow-lg rounded-xl px-3 py-2 items-center gap-2 border border-gray-100">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${GOLD}20`, color: GOLD }}><Calculator size={14} /></div>
              <div>
                <div className="text-[10px] text-gray-400">تكلفة / م²</div>
                <div className="text-xs font-bold" style={{ color: NAVY }}>300 ر.س</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGOS / STATS BAR */}
      <section className="border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { v: '+250', l: 'مشروع نشط' },
            { v: '+4.2M', l: 'ر.س تم تتبعها' },
            { v: '9', l: 'عملات مدعومة' },
            { v: '%99.9', l: 'وقت تشغيل' },
          ].map(s => (
            <div key={s.l}>
              <div className="text-2xl md:text-3xl font-bold" style={{ color: NAVY }}>{s.v}</div>
              <div className="text-xs text-gray-500 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: GOLD }}>المميزات</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: NAVY }}>كل ما تحتاجه لإدارة مشروعك</h2>
            <p className="text-gray-500 leading-relaxed">أدوات احترافية مصممة خصيصاً لقطاع البناء والمقاولات — بواجهة بسيطة وتجربة استخدام سلسة</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#B38A3B]/40 hover:shadow-xl transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ background: `${GOLD}15`, color: GOLD }}
                >
                  <f.icon size={22} />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: NAVY }}>{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                <div className="absolute bottom-0 right-6 h-0.5 w-0 group-hover:w-12 transition-all" style={{ background: GOLD }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 md:py-28 relative overflow-hidden" style={{ background: NAVY }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, ${GOLD} 1px, transparent 1px), radial-gradient(circle at 80% 80%, ${GOLD} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: GOLD }}>كيف يعمل</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">ثلاث خطوات للتحكم الكامل</h2>
            <p className="text-white/60">ابدأ في دقيقة — بدون تعقيدات أو إعدادات طويلة</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-7 h-full hover:bg-white/10 transition">
                  <div className="flex items-center justify-between mb-5">
                    <div className="text-4xl font-bold" style={{ color: GOLD }}>{s.n}</div>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                      {i === 0 && <Wallet size={18} />}
                      {i === 1 && <TrendingUp size={18} />}
                      {i === 2 && <ShieldCheck size={18} />}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -left-3 -translate-y-1/2 text-white/20 z-10">
                    <ArrowLeft size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: GOLD }}>الأسعار</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: NAVY }}>خطط بسيطة تنمو مع مشروعك</h2>
            <p className="text-gray-500">ابدأ مجاناً وارتقِ حسب احتياجاتك — بدون عقود طويلة</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 items-stretch">
            {plans.map(p => (
              <div
                key={p.id}
                className={`relative rounded-2xl p-7 transition-all ${
                  p.highlight
                    ? 'shadow-2xl scale-[1.02] border-2'
                    : 'border border-gray-100 hover:shadow-lg bg-white'
                }`}
                style={p.highlight ? { background: NAVY, borderColor: GOLD } : undefined}
              >
                {p.highlight && (
                  <div className="absolute -top-3 right-1/2 translate-x-1/2 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full" style={{ background: GOLD }}>
                    الأكثر شعبية
                  </div>
                )}
                <div className={`text-sm font-medium mb-2 ${p.highlight ? 'text-[#B38A3B]' : 'text-gray-500'}`}>{p.name}</div>
                <div className={`flex items-baseline gap-1 mb-1 ${p.highlight ? 'text-white' : ''}`} style={!p.highlight ? { color: NAVY } : undefined}>
                  {p.price === 0 ? (
                    <span className="text-4xl font-bold">مجاني</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold">{p.price}</span>
                      <span className="text-xs opacity-70">ر.س/شهرياً</span>
                    </>
                  )}
                </div>
                <div className={`text-xs mb-6 ${p.highlight ? 'text-white/60' : 'text-gray-400'}`}>{p.tagline}</div>
                <ul className="space-y-3 mb-7">
                  {p.features.map((f, i) => (
                    <li key={i} className={`flex items-start gap-2 text-sm ${p.highlight ? 'text-white/90' : 'text-gray-700'}`}>
                      <span
                        className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white"
                        style={{ background: GOLD }}
                      >✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onStart}
                  className={`w-full font-bold py-3 rounded-xl text-sm transition-colors ${
                    p.highlight ? 'text-white hover:opacity-90' : 'text-white hover:opacity-90'
                  }`}
                  style={{ background: p.highlight ? GOLD : NAVY }}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
            <Landmark size={12} /> الدفع يدعم التحويل البنكي عبر stc bank
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-3xl p-10 md:p-14 text-center" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3560 100%)` }}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: GOLD }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-10 bg-white" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs mb-5">
                <Clock size={12} /> جاهز خلال دقائق
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">ابدأ مشروعك الآن بسيطرة كاملة</h2>
              <p className="text-white/70 max-w-xl mx-auto mb-8">انضم إلى مئات المقاولين والملاك الذين يديرون مصاريف مشاريعهم بذكاء وراحة بال</p>
              <button
                onClick={onStart}
                className="inline-flex items-center gap-2 font-bold px-8 h-14 rounded-2xl shadow-xl hover:-translate-y-0.5 transition-transform"
                style={{ background: GOLD, color: 'white' }}
              >
                ابدأ مشروعك الآن
                <ArrowLeft size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: NAVY }}>
              <Building2 size={14} className="text-white" />
            </div>
            <div className="text-sm font-bold" style={{ color: NAVY }}>BuildExpense Pro</div>
          </div>
          <div className="text-xs text-gray-400">© {new Date().getFullYear()} جميع الحقوق محفوظة</div>
        </div>
      </footer>
    </div>
  );
}
