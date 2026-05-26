import { useState, useMemo, useEffect } from 'react';
import { Plus, X, Building2, TrendingUp, TrendingDown, Layers, Wrench, Zap, ChevronDown, Menu, Tag, Wallet, Scale, LayoutDashboard, Pencil, Trash2, Shield, CheckCircle2, Copy, Clock, Landmark } from 'lucide-react';

type CurrencyCode = 'SAR' | 'AED' | 'KWD' | 'QAR' | 'BHD' | 'OMR' | 'USD' | 'EUR' | 'EGP';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  ar: string;
  en: string;
  rateFromSAR: number; // 1 SAR = rateFromSAR units of this currency
}

const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  SAR: { code: 'SAR', symbol: 'ر.س', ar: 'ريال سعودي', en: 'Saudi Riyal', rateFromSAR: 1 },
  AED: { code: 'AED', symbol: 'د.إ', ar: 'درهم إماراتي', en: 'UAE Dirham', rateFromSAR: 0.979 },
  KWD: { code: 'KWD', symbol: 'د.ك', ar: 'دينار كويتي', en: 'Kuwaiti Dinar', rateFromSAR: 0.0816 },
  QAR: { code: 'QAR', symbol: 'ر.ق', ar: 'ريال قطري', en: 'Qatari Riyal', rateFromSAR: 0.971 },
  BHD: { code: 'BHD', symbol: 'د.ب', ar: 'دينار بحريني', en: 'Bahraini Dinar', rateFromSAR: 0.100 },
  OMR: { code: 'OMR', symbol: 'ر.ع', ar: 'ريال عماني', en: 'Omani Rial', rateFromSAR: 0.103 },
  USD: { code: 'USD', symbol: '$', ar: 'دولار أمريكي', en: 'US Dollar', rateFromSAR: 0.2666 },
  EUR: { code: 'EUR', symbol: '€', ar: 'يورو', en: 'Euro', rateFromSAR: 0.2443 },
  EGP: { code: 'EGP', symbol: 'ج.م', ar: 'جنيه مصري', en: 'Egyptian Pound', rateFromSAR: 13.12 },
};

const CURRENCY_ORDER: CurrencyCode[] = ['SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR', 'USD', 'EUR', 'EGP'];

type PlanId = 'free' | 'pro' | 'business';
const FREE_TX_LIMIT = 20;

interface PlanInfo {
  id: PlanId;
  ar: string;
  en: string;
  priceSAR: number;
  features: { ar: string; en: string }[];
  highlight?: boolean;
}

const PLANS: PlanInfo[] = [
  {
    id: 'free',
    ar: 'المجاني',
    en: 'Free',
    priceSAR: 0,
    features: [
      { ar: `حتى ${FREE_TX_LIMIT} معاملة`, en: `Up to ${FREE_TX_LIMIT} transactions` },
      { ar: 'لوحة تحكم مالية', en: 'Financial dashboard' },
      { ar: 'تتبع الفئات الأساسية', en: 'Basic category tracking' },
    ],
  },
  {
    id: 'pro',
    ar: 'الاحترافي',
    en: 'Pro',
    priceSAR: 99,
    highlight: true,
    features: [
      { ar: 'معاملات غير محدودة', ar2: '', en: 'Unlimited transactions' } as any,
      { ar: 'جميع الفئات والأنواع', en: 'All categories & types' },
      { ar: 'تعدد العملات', en: 'Multi-currency' },
      { ar: 'دعم فني سريع', en: 'Priority support' },
    ],
  },
  {
    id: 'business',
    ar: 'الأعمال',
    en: 'Business',
    priceSAR: 299,
    features: [
      { ar: 'كل مزايا الاحترافي', en: 'Everything in Pro' },
      { ar: 'تقارير متقدمة', en: 'Advanced reports' },
      { ar: 'تصدير البيانات', en: 'Data export' },
      { ar: 'مستخدمون متعددون', en: 'Multiple users' },
    ],
  },
];

type Category = 'materials' | 'contracting' | 'services';
type Lang = 'ar' | 'en';

interface Subcategory {
  id: string;
  parent: Category;
  ar: string;
  en: string;
  custom?: boolean;
}

interface BaseTx {
  id: string;
  category: Category;
  subcategoryId: string;
  date: string;
  accountingCode: string;
  description: string;
  amount: number;
}
interface MaterialsTx extends BaseTx {
  category: 'materials';
  supplier: string;
  quantity: number;
}
interface ContractingTx extends BaseTx {
  category: 'contracting';
  contractor: string;
  paymentNumber: string;
}
interface ServicesTx extends BaseTx {
  category: 'services';
  entity: string;
  receiptNumber: string;
}
type Transaction = MaterialsTx | ContractingTx | ServicesTx;

const PROJECT_AREA = 1262;

const labels = {
  ar: {
    appName: 'BuildExpense Pro',
    totalBudget: 'الميزانية الإجمالية',
    totalExpenses: 'إجمالي المصاريف',
    variance: 'الفرق',
    costPerMeter: 'التكلفة لكل متر',
    addExpense: '+ إضافة معاملة',
    materials: 'المواد',
    contracting: 'المقاولات',
    services: 'الخدمات',
    date: 'التاريخ',
    accountingCode: 'رقم الحساب',
    supplier: 'المورد',
    contractor: 'المقاول',
    entity: 'الجهة',
    paymentNumber: 'رقم الدفعة',
    receiptNumber: 'رقم الإيصال',
    description: 'البيان',
    quantity: 'الكمية',
    amount: 'المبلغ',
    totalAmount: 'الإجمالي',
    category: 'الفئة',
    subcategory: 'النوع',
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    addNewExpense: 'إضافة معاملة جديدة',
    editExpense: 'تعديل معاملة',
    noExpenses: 'لا توجد معاملات',
    projectArea: 'مساحة المشروع',
    sar: 'ر.س',
    perMeter: '/م²',
    currency: 'العملة',
    pricing: 'الأسعار',
    currentPlan: 'الخطة الحالية',
    upgrade: 'ترقية',
    upgradeNow: 'الترقية الآن',
    upgradeToContinue: 'قم بالترقية للمتابعة',
    limitReached: 'لقد وصلت إلى الحد الأقصى للخطة المجانية',
    limitReachedDesc: `خطتك الحالية المجانية تسمح بـ ${FREE_TX_LIMIT} معاملة فقط. قم بالترقية للاستمرار في إضافة المعاملات.`,
    choosePlan: 'اختر الخطة المناسبة',
    choosePlanDesc: 'خطط بسيطة ومرنة تنمو مع مشروعك',
    perMonth: '/شهرياً',
    free: 'مجاني',
    currentlyActive: 'الخطة النشطة',
    month: 'شهر',
    reports: 'التقارير',
    txUsed: 'المعاملات',
    unlimited: 'غير محدود',
    advancedReports: 'التقارير المتقدمة',
    reportsLocked: 'التقارير المتقدمة متاحة في خطة الأعمال',
    downgrade: 'تخفيض',
    planDetails: 'تفاصيل الخطة',
    completePayment: 'إتمام الدفع',
    secureCheckout: 'دفع آمن عبر PayPal',
    payWithPaypal: 'ادفع عبر PayPal',
    paymentSuccess: 'تمت الترقية بنجاح',
    paymentSuccessDesc: 'شكراً لك! تم تفعيل خطتك الجديدة.',
    paymentFailed: 'فشل الدفع',
    paymentFailedDesc: 'حدث خطأ أثناء معالجة الدفع. الرجاء المحاولة مرة أخرى.',
    loading: 'جاري التحميل...',
    orderSummary: 'ملخص الطلب',
    close: 'إغلاق',
    done: 'تم',
    processing: 'جاري المعالجة...',
    all: 'الكل',
    categories: 'الفئات',
    addCategory: 'إضافة فئة',
    newCategoryName: 'اسم الفئة الجديدة',
    add: 'إضافة',
    editBudget: 'تعديل',
    monthlyCashflow: 'التدفق النقدي الشهري',
    expensesByCategory: 'المصاريف حسب الفئة',
    categoryBreakdown: 'تفصيل الفئات',
    categoryName: 'الفئة',
    percentage: 'النسبة',
    underBudget: 'تحت الميزانية',
    overBudget: 'تجاوز الميزانية',
    dashboard: 'لوحة التحكم',
    transactions: 'دفتر المعاملات',
    total: 'الإجمالي',
    actions: 'إجراءات',
    type: 'النوع',
    months: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
  },
  en: {
    appName: 'BuildExpense Pro',
    totalBudget: 'Total Budget',
    totalExpenses: 'Total Expenses',
    variance: 'Variance',
    costPerMeter: 'Cost per m²',
    addExpense: '+ Add Transaction',
    materials: 'Materials',
    contracting: 'Contracting',
    services: 'Services',
    date: 'Date',
    accountingCode: 'Accounting Code',
    supplier: 'Supplier',
    contractor: 'Contractor',
    entity: 'Entity',
    paymentNumber: 'Payment #',
    receiptNumber: 'Receipt #',
    description: 'Description',
    quantity: 'Quantity',
    amount: 'Amount',
    totalAmount: 'Total Amount',
    category: 'Category',
    subcategory: 'Type',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    addNewExpense: 'Add New Transaction',
    editExpense: 'Edit Transaction',
    noExpenses: 'No transactions',
    projectArea: 'Project Area',
    sar: 'SAR',
    perMeter: '/m²',
    currency: 'Currency',
    pricing: 'Pricing',
    currentPlan: 'Current Plan',
    upgrade: 'Upgrade',
    upgradeNow: 'Upgrade Now',
    upgradeToContinue: 'Upgrade to continue',
    limitReached: "You've reached the Free plan limit",
    limitReachedDesc: `Your Free plan allows only ${FREE_TX_LIMIT} transactions. Upgrade to keep adding transactions.`,
    choosePlan: 'Choose Your Plan',
    choosePlanDesc: 'Simple, flexible plans that scale with your project',
    perMonth: '/month',
    free: 'Free',
    currentlyActive: 'Current Plan',
    month: 'month',
    reports: 'Reports',
    txUsed: 'Transactions',
    unlimited: 'Unlimited',
    advancedReports: 'Advanced Reports',
    reportsLocked: 'Advanced Reports are available on the Business plan',
    downgrade: 'Downgrade',
    planDetails: 'Plan Details',
    completePayment: 'Complete Payment',
    secureCheckout: 'Secure checkout with PayPal',
    payWithPaypal: 'Pay with PayPal',
    paymentSuccess: 'Upgrade Successful',
    paymentSuccessDesc: 'Thank you! Your new plan is now active.',
    paymentFailed: 'Payment Failed',
    paymentFailedDesc: 'Something went wrong processing your payment. Please try again.',
    loading: 'Loading...',
    orderSummary: 'Order Summary',
    close: 'Close',
    done: 'Done',
    processing: 'Processing...',
    all: 'All',
    categories: 'Categories',
    addCategory: 'Add Category',
    newCategoryName: 'New category name',
    add: 'Add',
    editBudget: 'Edit',
    monthlyCashflow: 'Monthly Cash Flow',
    expensesByCategory: 'Expenses by Category',
    categoryBreakdown: 'Category Breakdown',
    categoryName: 'Category',
    percentage: 'Percentage',
    underBudget: 'Under Budget',
    overBudget: 'Over Budget',
    dashboard: 'Dashboard',
    transactions: 'Transactions Ledger',
    total: 'Total',
    actions: 'Actions',
    type: 'Type',
    months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  },
};

const categoryIcons: Record<Category, React.ReactNode> = {
  materials: <Layers size={16} />,
  contracting: <Wrench size={16} />,
  services: <Zap size={16} />,
};

const categoryChartColors: Record<Category, string> = {
  materials: '#0B1F3B',
  contracting: '#B38A3B',
  services: '#5B7FA6',
};

const defaultSubcategories: Subcategory[] = [
  { id: 'm-iron', parent: 'materials', ar: 'حديد', en: 'Iron' },
  { id: 'm-concrete', parent: 'materials', ar: 'خرسانة جاهزة', en: 'Ready Mix Concrete' },
  { id: 'm-block', parent: 'materials', ar: 'طابوق', en: 'Block' },
  { id: 'm-insulation', parent: 'materials', ar: 'عزل', en: 'Insulation' },
  { id: 'm-doors', parent: 'materials', ar: 'أبواب', en: 'Doors' },
  { id: 'm-windows', parent: 'materials', ar: 'نوافذ', en: 'Windows' },
  { id: 'm-steeldoors', parent: 'materials', ar: 'أبواب حديدية', en: 'Steel Doors' },
  { id: 'm-tiles', parent: 'materials', ar: 'بلاط', en: 'Tiles' },
  { id: 'm-gypsum', parent: 'materials', ar: 'جبس', en: 'Gypsum' },
  { id: 'm-paint', parent: 'materials', ar: 'دهانات', en: 'Paint' },
  { id: 'm-fixtures', parent: 'materials', ar: 'تجهيزات', en: 'Fixtures' },
  { id: 'm-plumbing', parent: 'materials', ar: 'سباكة', en: 'Plumbing' },
  { id: 'm-electricity', parent: 'materials', ar: 'كهرباء', en: 'Electricity' },
  { id: 'm-sanitary', parent: 'materials', ar: 'أدوات صحية', en: 'Sanitary' },
  { id: 'm-water', parent: 'materials', ar: 'ماء', en: 'Water' },
  { id: 'c-main', parent: 'contracting', ar: 'المقاول الرئيسي', en: 'Main Contractor' },
  { id: 'c-excavation', parent: 'contracting', ar: 'حفريات', en: 'Excavation' },
  { id: 'c-backfilling', parent: 'contracting', ar: 'ردميات', en: 'Backfilling' },
  { id: 'c-consultant', parent: 'contracting', ar: 'استشاري', en: 'Consultant' },
  { id: 'c-carpentry', parent: 'contracting', ar: 'نجارة', en: 'Carpentry' },
  { id: 'c-plastering', parent: 'contracting', ar: 'لياسة', en: 'Plastering' },
  { id: 'c-electrical', parent: 'contracting', ar: 'مقاول كهرباء', en: 'Electrical Contractor' },
  { id: 'c-plumbing', parent: 'contracting', ar: 'مقاول سباكة', en: 'Plumbing Contractor' },
  { id: 'c-security', parent: 'contracting', ar: 'حارس أمن', en: 'Security Guard' },
  { id: 's-civildefense', parent: 'services', ar: 'الدفاع المدني', en: 'Civil Defense' },
  { id: 's-electric-meters', parent: 'services', ar: 'عدادات كهرباء', en: 'Electricity Meters' },
  { id: 's-water-meters', parent: 'services', ar: 'عدادات ماء وصرف', en: 'Water & Sewage Meters' },
];

const initialTx: Transaction[] = [
  { id: '1', category: 'materials', subcategoryId: 'm-iron', date: '2026-01-10', accountingCode: 'MAT-1001', supplier: 'شركة حديد الراجحي', description: 'حديد تسليح 12 مم', quantity: 5800, amount: 145000 },
  { id: '2', category: 'materials', subcategoryId: 'm-concrete', date: '2026-01-22', accountingCode: 'MAT-1002', supplier: 'الخرسانة السعودية', description: 'خرسانة جاهزة B350', quantity: 320, amount: 98000 },
  { id: '3', category: 'contracting', subcategoryId: 'c-excavation', date: '2026-02-05', accountingCode: 'CON-2001', contractor: 'مؤسسة الأرض للحفريات', paymentNumber: 'PAY-001', description: 'حفريات الأساسات', amount: 42000 },
  { id: '4', category: 'contracting', subcategoryId: 'c-main', date: '2026-02-18', accountingCode: 'CON-2002', contractor: 'شركة البناء الحديث', paymentNumber: 'PAY-002', description: 'دفعة أولى للمقاول الرئيسي', amount: 120000 },
  { id: '5', category: 'materials', subcategoryId: 'm-block', date: '2026-03-03', accountingCode: 'MAT-1003', supplier: 'مصنع الطابوق الأحمر', description: 'طابوق أحمر مفرغ', quantity: 12000, amount: 38000 },
  { id: '6', category: 'contracting', subcategoryId: 'c-plastering', date: '2026-03-21', accountingCode: 'CON-2003', contractor: 'مؤسسة اللياسة المتقنة', paymentNumber: 'PAY-003', description: 'لياسة داخلية', amount: 55000 },
  { id: '7', category: 'materials', subcategoryId: 'm-tiles', date: '2026-04-08', accountingCode: 'MAT-1004', supplier: 'معرض البلاط الملكي', description: 'بلاط بورسلين 60×60', quantity: 850, amount: 62000 },
  { id: '8', category: 'services', subcategoryId: 's-electric-meters', date: '2026-04-15', accountingCode: 'SRV-3001', entity: 'شركة الكهرباء السعودية', receiptNumber: 'RCP-501', description: 'رسوم توصيل عدادات', amount: 14500 },
  { id: '9', category: 'materials', subcategoryId: 'm-paint', date: '2026-04-25', accountingCode: 'MAT-1005', supplier: 'معرض الجزيرة للدهانات', description: 'دهانات داخلية', quantity: 120, amount: 28000 },
];

function formatNumber(n: number) {
  return Math.round(n).toLocaleString('en-US');
}

function formatCompact(n: number) {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(n) >= 1_000) return Math.round(n / 1_000) + 'K';
  return String(Math.round(n));
}

function LineChart({ data, months, color = '#B38A3B' }: { data: number[]; months: string[]; color?: string }) {
  const W = 640, H = 220, P = 36;
  const max = Math.max(...data, 1);
  const stepX = (W - P * 2) / Math.max(data.length - 1, 1);
  const points = data.map((v, i) => [P + i * stepX, H - P - (v / max) * (H - P * 2)] as const);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${path} L ${P + (data.length - 1) * stepX} ${H - P} L ${P} ${H - P} Z`;
  const yTicks = 4;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const y = P + (i * (H - P * 2)) / yTicks;
        const val = max * (1 - i / yTicks);
        return (
          <g key={i}>
            <line x1={P} y1={y} x2={W - P} y2={y} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3 3" />
            <text x={P - 6} y={y + 4} fontSize="10" fill="#9CA3AF" textAnchor="end">{formatCompact(val)}</text>
          </g>
        );
      })}
      <path d={area} fill="url(#lineFill)" />
      <path d={path} stroke={color} strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="3.5" fill="#fff" stroke={color} strokeWidth="2" />
          <text x={p[0]} y={H - P + 16} fontSize="10" fill="#6B7280" textAnchor="middle">{months[i]}</text>
        </g>
      ))}
    </svg>
  );
}

function PieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = 80, CX = 110, CY = 110, IR = 45;
  let angle = -Math.PI / 2;
  if (total === 0) {
    return (
      <svg viewBox="0 0 220 220" className="w-full max-w-[220px] h-auto">
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#E5E7EB" strokeWidth="30" />
      </svg>
    );
  }
  const slices = data.map(d => {
    const pct = d.value / total;
    const a0 = angle; const a1 = angle + pct * 2 * Math.PI; angle = a1;
    const large = pct > 0.5 ? 1 : 0;
    const x0 = CX + R * Math.cos(a0), y0 = CY + R * Math.sin(a0);
    const x1 = CX + R * Math.cos(a1), y1 = CY + R * Math.sin(a1);
    const xi0 = CX + IR * Math.cos(a0), yi0 = CY + IR * Math.sin(a0);
    const xi1 = CX + IR * Math.cos(a1), yi1 = CY + IR * Math.sin(a1);
    return `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${IR} ${IR} 0 ${large} 0 ${xi0} ${yi0} Z`;
  });
  return (
    <svg viewBox="0 0 220 220" className="w-full max-w-[220px] h-auto">
      {slices.map((p, i) => <path key={i} d={p} fill={data[i].color} />)}
    </svg>
  );
}

interface FormState {
  category: Category;
  subcategoryId: string;
  date: string;
  accountingCode: string;
  description: string;
  amount: string;
  supplier: string;
  quantity: string;
  contractor: string;
  paymentNumber: string;
  entity: string;
  receiptNumber: string;
}

function emptyForm(category: Category, subcategoryId: string): FormState {
  return {
    category,
    subcategoryId,
    date: new Date().toISOString().slice(0, 10),
    accountingCode: '',
    description: '',
    amount: '',
    supplier: '',
    quantity: '',
    contractor: '',
    paymentNumber: '',
    entity: '',
    receiptNumber: '',
  };
}

function txToForm(tx: Transaction): FormState {
  return {
    category: tx.category,
    subcategoryId: tx.subcategoryId,
    date: tx.date,
    accountingCode: tx.accountingCode,
    description: tx.description,
    amount: String(tx.amount),
    supplier: tx.category === 'materials' ? tx.supplier : '',
    quantity: tx.category === 'materials' ? String(tx.quantity) : '',
    contractor: tx.category === 'contracting' ? tx.contractor : '',
    paymentNumber: tx.category === 'contracting' ? tx.paymentNumber : '',
    entity: tx.category === 'services' ? tx.entity : '',
    receiptNumber: tx.category === 'services' ? tx.receiptNumber : '',
  };
}

export default function App() {
  const [lang, setLang] = useState<Lang>('ar');
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    if (typeof window === 'undefined') return 'SAR';
    const saved = localStorage.getItem('user_currency');
    return (saved && saved in CURRENCIES ? saved : 'SAR') as CurrencyCode;
  });
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  useEffect(() => { localStorage.setItem('user_currency', currency); }, [currency]);

  const curInfo = CURRENCIES[currency];
  const rate = curInfo.rateFromSAR;
  const symbol = curInfo.symbol;
  const toDisplay = (sar: number) => sar * rate;
  const toSAR = (display: number) => display / rate;
  const fmtAmount = (sarAmount: number) => Math.round(toDisplay(sarAmount)).toLocaleString('en-US');

  const [transactions, setTransactions] = useState<Transaction[]>(initialTx);
  const [subcategories, setSubcategories] = useState<Subcategory[]>(defaultSubcategories);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<{ type: 'all' | 'category' | 'sub'; value: string }>({ type: 'all', value: '' });
  const [totalBudget, setTotalBudget] = useState(1_200_000);
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('1200000');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<Category | null>('materials');
  const [addCatOpen, setAddCatOpen] = useState<Category | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [form, setForm] = useState<FormState>(emptyForm('materials', 'm-iron'));
  const [formError, setFormError] = useState('');
  const [plan, setPlan] = useState<PlanId>(() => {
    if (typeof window === 'undefined') return 'free';
    const saved = localStorage.getItem('user_plan');
    return (saved === 'pro' || saved === 'business' || saved === 'free') ? saved as PlanId : 'free';
  });
  useEffect(() => { localStorage.setItem('user_plan', plan); }, [plan]);
  const [pendingPlan, setPendingPlan] = useState<PlanId | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('user_pending_plan');
    return (saved === 'pro' || saved === 'business') ? saved as PlanId : null;
  });
  useEffect(() => {
    if (pendingPlan) localStorage.setItem('user_pending_plan', pendingPlan);
    else localStorage.removeItem('user_pending_plan');
  }, [pendingPlan]);
  const [view, setView] = useState<'dashboard' | 'pricing' | 'reports'>('dashboard');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<PlanId | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const t = labels[lang];
  const isRTL = lang === 'ar';
  const categoryList: Category[] = ['materials', 'contracting', 'services'];

  const totalExpenses = useMemo(() => transactions.reduce((s, e) => s + e.amount, 0), [transactions]);
  const variance = totalBudget - totalExpenses;
  const varianceIsPositive = variance >= 0;
  const costPerMeter = Math.round(totalExpenses / PROJECT_AREA);

  const subsByCategory = useMemo(() => ({
    materials: subcategories.filter(s => s.parent === 'materials'),
    contracting: subcategories.filter(s => s.parent === 'contracting'),
    services: subcategories.filter(s => s.parent === 'services'),
  }), [subcategories]);

  const categoryTotals = useMemo(() => ({
    materials: transactions.filter(e => e.category === 'materials').reduce((s, e) => s + e.amount, 0),
    contracting: transactions.filter(e => e.category === 'contracting').reduce((s, e) => s + e.amount, 0),
    services: transactions.filter(e => e.category === 'services').reduce((s, e) => s + e.amount, 0),
  }), [transactions]);

  const monthlyData = useMemo(() => {
    const buckets = new Array(12).fill(0);
    transactions.forEach(e => {
      const m = new Date(e.date).getMonth();
      if (m >= 0 && m < 12) buckets[m] += e.amount;
    });
    return buckets;
  }, [transactions]);

  const filteredTx = useMemo(() => {
    let list = transactions;
    if (filter.type === 'category') list = list.filter(e => e.category === filter.value);
    else if (filter.type === 'sub') list = list.filter(e => e.subcategoryId === filter.value);
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, filter]);

  // Group filtered for ledger display when 'all' or 'category'
  const txByCategory = useMemo(() => ({
    materials: filteredTx.filter(x => x.category === 'materials') as MaterialsTx[],
    contracting: filteredTx.filter(x => x.category === 'contracting') as ContractingTx[],
    services: filteredTx.filter(x => x.category === 'services') as ServicesTx[],
  }), [filteredTx]);

  const subLabel = (id: string) => {
    const s = subcategories.find(x => x.id === id);
    return s ? s[lang] : id;
  };

  const atFreeLimit = plan === 'free' && transactions.length >= FREE_TX_LIMIT;

  function openAdd() {
    if (atFreeLimit) { setUpgradeModalOpen(true); return; }
    setEditingId(null);
    setForm(emptyForm('materials', subcategories.find(s => s.parent === 'materials')?.id || ''));
    setFormError('');
    setShowModal(true);
  }

  function openEdit(tx: Transaction) {
    setEditingId(tx.id);
    const f = txToForm(tx);
    f.amount = String(Math.round(toDisplay(tx.amount)));
    setForm(f);
    setFormError('');
    setShowModal(true);
  }

  function handleSave() {
    if (!editingId && plan === 'free' && transactions.length >= FREE_TX_LIMIT) {
      setShowModal(false); setUpgradeModalOpen(true); return;
    }
    const amountInput = Number(form.amount);
    if (!form.accountingCode.trim()) { setFormError(isRTL ? 'أدخل رقم الحساب' : 'Enter accounting code'); return; }
    if (!form.description.trim()) { setFormError(isRTL ? 'أدخل البيان' : 'Enter description'); return; }
    if (isNaN(amountInput) || amountInput <= 0) { setFormError(isRTL ? 'أدخل مبلغاً صحيحاً' : 'Enter a valid amount'); return; }
    const amount = toSAR(amountInput);
    if (!form.date) { setFormError(isRTL ? 'أدخل التاريخ' : 'Enter date'); return; }
    if (!form.subcategoryId) { setFormError(isRTL ? 'اختر النوع' : 'Select type'); return; }

    let tx: Transaction;
    const base = {
      id: editingId || Date.now().toString(),
      subcategoryId: form.subcategoryId,
      date: form.date,
      accountingCode: form.accountingCode.trim(),
      description: form.description.trim(),
      amount,
    };

    if (form.category === 'materials') {
      if (!form.supplier.trim()) { setFormError(isRTL ? 'أدخل المورد' : 'Enter supplier'); return; }
      tx = { ...base, category: 'materials', supplier: form.supplier.trim(), quantity: Number(form.quantity) || 0 };
    } else if (form.category === 'contracting') {
      if (!form.contractor.trim()) { setFormError(isRTL ? 'أدخل المقاول' : 'Enter contractor'); return; }
      tx = { ...base, category: 'contracting', contractor: form.contractor.trim(), paymentNumber: form.paymentNumber.trim() };
    } else {
      if (!form.entity.trim()) { setFormError(isRTL ? 'أدخل الجهة' : 'Enter entity'); return; }
      tx = { ...base, category: 'services', entity: form.entity.trim(), receiptNumber: form.receiptNumber.trim() };
    }

    setTransactions(prev => editingId ? prev.map(p => p.id === editingId ? tx : p) : [tx, ...prev]);
    setShowModal(false);
    setEditingId(null);
  }

  function handleDelete(id: string) {
    setTransactions(prev => prev.filter(e => e.id !== id));
  }

  function handleBudgetSave() {
    const val = Number(budgetInput);
    if (!isNaN(val) && val >= 0) setTotalBudget(toSAR(val));
    setEditingBudget(false);
  }

  function toggleLang() {
    const next = lang === 'ar' ? 'en' : 'ar';
    setLang(next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
  }

  function handleAddCustomCategory(parent: Category) {
    const name = newCatName.trim();
    if (!name) return;
    setSubcategories(prev => [...prev, { id: `${parent}-custom-${Date.now()}`, parent, ar: name, en: name, custom: true }]);
    setNewCatName('');
    setAddCatOpen(null);
  }

  function onCategoryChange(cat: Category) {
    const first = subcategories.find(s => s.parent === cat);
    setForm(f => ({ ...f, category: cat, subcategoryId: first ? first.id : '' }));
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-dubai" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-[#0B1F3B] shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white"><Menu size={22} /></button>
            <div className="bg-[#B38A3B] rounded-lg p-2"><Building2 size={22} className="text-white" /></div>
            <span className="text-white font-bold text-xl tracking-wide">{t.appName}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setCurrencyMenuOpen(o => !o)}
                onBlur={() => setTimeout(() => setCurrencyMenuOpen(false), 150)}
                className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-white/10"
              >
                <span className="font-bold text-[#B38A3B]">{curInfo.symbol}</span>
                <span>{curInfo.code}</span>
                <ChevronDown size={14} className={`transition-transform ${currencyMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {currencyMenuOpen && (
                <div className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[220px] z-50 max-h-80 overflow-y-auto`}>
                  {CURRENCY_ORDER.map(code => {
                    const c = CURRENCIES[code];
                    const active = code === currency;
                    return (
                      <button
                        key={code}
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => { setCurrency(code); setCurrencyMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-start hover:bg-gray-50 ${active ? 'bg-[#B38A3B]/5' : ''}`}
                      >
                        <span className={`w-8 font-bold ${active ? 'text-[#B38A3B]' : 'text-[#0B1F3B]'}`}>{c.symbol}</span>
                        <span className="flex-1">
                          <span className="font-medium text-[#0B1F3B]">{c.code}</span>
                          <span className="text-gray-400 mx-2">·</span>
                          <span className="text-xs text-gray-500">{c[lang]}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <button onClick={toggleLang} className="bg-[#B38A3B] hover:bg-[#9a7530] text-white font-bold px-4 py-1.5 rounded-lg text-sm">
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-[68px] ${isRTL ? 'right-0' : 'left-0'} z-30 h-[calc(100vh-68px)] w-72 bg-white border-${isRTL ? 'l' : 'r'} border-gray-100 overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')} lg:translate-x-0`}>
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#0B1F3B] font-bold text-sm flex items-center gap-2">
                <Tag size={16} className="text-[#B38A3B]" /> {t.categories}
              </h3>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400"><X size={18} /></button>
            </div>
            <button
              onClick={() => { setView('dashboard'); setFilter({ type: 'all', value: '' }); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mb-2 ${view === 'dashboard' && filter.type === 'all' ? 'bg-[#0B1F3B] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <LayoutDashboard size={16} />
              <span className="flex-1 text-start">{t.dashboard}</span>
            </button>
            <button
              onClick={() => { setView('reports'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mb-2 ${view === 'reports' ? 'bg-[#0B1F3B] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <TrendingUp size={16} />
              <span className="flex-1 text-start">{t.reports}</span>
              {plan !== 'business' && <span className="text-[9px] bg-[#B38A3B]/20 text-[#B38A3B] px-1.5 py-0.5 rounded font-bold">PRO</span>}
            </button>
            <button
              onClick={() => { setView('pricing'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mb-2 ${view === 'pricing' ? 'bg-[#0B1F3B] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Scale size={16} />
              <span className="flex-1 text-start">{t.pricing}</span>
            </button>

            <div className="border-t border-gray-100 my-3" />

            <div className="mb-3 bg-gradient-to-br from-[#0B1F3B] to-[#1a3560] rounded-xl p-3 text-white">
              <div className="text-[10px] uppercase tracking-wider text-white/60 mb-1">{t.currentPlan}</div>
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold">{PLANS.find(p => p.id === plan)?.[lang]}</div>
                {plan === 'free' && <span className="text-[9px] bg-[#B38A3B] text-white px-1.5 py-0.5 rounded font-bold">FREE</span>}
              </div>
              {plan === 'free' && (
                <>
                  <div className="text-[10px] text-white/70 mb-1">
                    {t.txUsed}: {transactions.length} / {FREE_TX_LIMIT}
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-[#B38A3B] transition-all" style={{ width: `${Math.min(100, (transactions.length / FREE_TX_LIMIT) * 100)}%` }} />
                  </div>
                  <button onClick={() => setView('pricing')} className="w-full bg-[#B38A3B] hover:bg-[#9a7530] text-white text-xs font-bold py-1.5 rounded-lg">
                    {t.upgrade}
                  </button>
                </>
              )}
              {plan !== 'free' && (
                <div className="text-[10px] text-white/70">{t.unlimited} {t.txUsed.toLowerCase()}</div>
              )}
              {pendingPlan && plan === 'free' && (
                <div className="mt-2 flex items-center gap-1.5 text-[10px] bg-amber-400/15 text-amber-200 px-2 py-1 rounded font-medium">
                  <Clock size={10} />
                  {isRTL ? `${PLANS.find(p => p.id === pendingPlan)?.ar} · قيد التفعيل` : `${PLANS.find(p => p.id === pendingPlan)?.en} · Pending`}
                </div>
              )}
            </div>
            {categoryList.map(cat => {
              const isExpanded = expandedGroup === cat;
              const active = filter.type === 'category' && filter.value === cat;
              return (
                <div key={cat} className="mb-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setFilter({ type: 'category', value: cat }); setSidebarOpen(false); }}
                      className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold ${active ? 'bg-[#B38A3B] text-white' : 'text-[#0B1F3B] hover:bg-gray-50'}`}
                    >
                      {categoryIcons[cat]}
                      <span className="flex-1 text-start">{t[cat]}</span>
                      <span className="text-xs opacity-70">{subsByCategory[cat].length}</span>
                    </button>
                    <button onClick={() => setExpandedGroup(isExpanded ? null : cat)} className="p-2 text-gray-400 hover:text-[#B38A3B]">
                      <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {isExpanded && (
                    <div className={`${isRTL ? 'mr-4 border-r' : 'ml-4 border-l'} border-gray-100 pl-3 pr-3 mt-1 space-y-0.5`}>
                      {subsByCategory[cat].map(sub => {
                        const subActive = filter.type === 'sub' && filter.value === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => { setFilter({ type: 'sub', value: sub.id }); setSidebarOpen(false); }}
                            className={`w-full text-start px-3 py-1.5 rounded-md text-xs ${subActive ? 'bg-[#B38A3B]/10 text-[#B38A3B] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                          >
                            {sub[lang]}{sub.custom && <span className="text-[10px] opacity-60 mx-1">●</span>}
                          </button>
                        );
                      })}
                      {addCatOpen === cat ? (
                        <div className="flex items-center gap-1 pt-2">
                          <input
                            value={newCatName}
                            onChange={e => setNewCatName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddCustomCategory(cat)}
                            placeholder={t.newCategoryName}
                            autoFocus
                            className="flex-1 border border-gray-200 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-[#B38A3B]"
                          />
                          <button onClick={() => handleAddCustomCategory(cat)} className="text-[#B38A3B] text-xs font-bold">{t.add}</button>
                          <button onClick={() => { setAddCatOpen(null); setNewCatName(''); }} className="text-gray-400"><X size={12} /></button>
                        </div>
                      ) : (
                        <button onClick={() => setAddCatOpen(cat)} className="w-full text-start px-3 py-1.5 rounded-md text-xs text-[#B38A3B] hover:bg-[#B38A3B]/5 flex items-center gap-1 mt-1">
                          <Plus size={12} /> {t.addCategory}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-20 lg:hidden" />}

        <main className="flex-1 px-4 py-8 space-y-6 min-w-0">
          {view === 'pricing' && (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto py-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#0B1F3B] mb-3">{t.choosePlan}</h1>
                <p className="text-gray-500">{t.choosePlanDesc}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {PLANS.map(p => {
                  const active = plan === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`relative rounded-2xl p-6 border transition-all ${
                        p.highlight
                          ? 'bg-[#0B1F3B] border-[#B38A3B] shadow-xl scale-[1.02]'
                          : 'bg-white border-gray-100 shadow-sm'
                      }`}
                    >
                      {p.highlight && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B38A3B] text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full">
                          {isRTL ? 'الأكثر شعبية' : 'Most Popular'}
                        </div>
                      )}
                      <div className={`text-sm font-medium mb-2 ${p.highlight ? 'text-[#B38A3B]' : 'text-gray-500'}`}>
                        {p[lang]}
                      </div>
                      <div className={`flex items-baseline gap-1 mb-1 ${p.highlight ? 'text-white' : 'text-[#0B1F3B]'}`}>
                        <span className="text-4xl font-bold">{p.priceSAR === 0 ? t.free : fmtAmount(p.priceSAR)}</span>
                        {p.priceSAR > 0 && <span className="text-xs opacity-70">{symbol}{t.perMonth}</span>}
                      </div>
                      <div className={`text-xs mb-6 ${p.highlight ? 'text-white/60' : 'text-gray-400'}`}>
                        {p.priceSAR === 0 ? (isRTL ? 'بدون بطاقة ائتمان' : 'No credit card required') : (isRTL ? 'ملغى في أي وقت' : 'Cancel anytime')}
                      </div>
                      <ul className="space-y-3 mb-6">
                        {p.features.map((f, i) => (
                          <li key={i} className={`flex items-start gap-2 text-sm ${p.highlight ? 'text-white/90' : 'text-gray-700'}`}>
                            <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                              p.highlight ? 'bg-[#B38A3B] text-white' : 'bg-[#B38A3B]/10 text-[#B38A3B]'
                            }`}>✓</span>
                            <span>{f[lang]}</span>
                          </li>
                        ))}
                      </ul>
                      {active ? (
                        <div className={`w-full text-center font-bold py-2.5 rounded-xl text-sm ${
                          p.highlight ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {t.currentlyActive}
                        </div>
                      ) : p.id === 'free' ? (
                        <button
                          onClick={() => { setPlan(p.id); setPendingPlan(null); setUpgradeModalOpen(false); }}
                          className="w-full font-bold py-2.5 rounded-xl text-sm bg-[#0B1F3B] hover:bg-[#1a3560] text-white"
                        >
                          {t.downgrade}
                        </button>
                      ) : pendingPlan === p.id ? (
                        <div className={`w-full text-center font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 ${
                          p.highlight ? 'bg-amber-400/20 text-amber-100 border border-amber-300/40' : 'bg-amber-50 text-[#B38A3B] border border-amber-200'
                        }`}>
                          <Clock size={14} />
                          {isRTL ? 'في انتظار التفعيل' : 'Pending Activation'}
                        </div>
                      ) : (
                        <button
                          onClick={() => { setCheckoutPlan(p.id); setPaymentStatus('idle'); setUpgradeModalOpen(false); }}
                          className={`w-full font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 ${
                            p.highlight
                              ? 'bg-[#B38A3B] hover:bg-[#9a7530] text-white'
                              : 'bg-[#0B1F3B] hover:bg-[#1a3560] text-white'
                          }`}
                        >
                          <Landmark size={15} />
                          {isRTL ? 'الدفع عبر stc bank' : 'Pay via stc bank'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-xs text-gray-400 pt-2">
                {isRTL ? 'نظام تجريبي — لا يتم خصم أي مبالغ' : 'Demo mode — no real payment is processed'}
              </p>
            </div>
          )}

          {view === 'reports' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              {plan === 'business' ? (
                <>
                  <TrendingUp size={40} className="mx-auto text-[#B38A3B] mb-3" />
                  <h2 className="text-xl font-bold text-[#0B1F3B] mb-2">{t.advancedReports}</h2>
                  <p className="text-gray-500 text-sm">{isRTL ? 'قريباً — تقارير شهرية وسنوية وتصدير PDF' : 'Coming soon — monthly & yearly reports, PDF export'}</p>
                </>
              ) : (
                <>
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-[#B38A3B]/10 text-[#B38A3B] flex items-center justify-center mb-4">
                    <TrendingUp size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-[#0B1F3B] mb-2">{t.advancedReports}</h2>
                  <p className="text-gray-500 text-sm mb-5">{t.reportsLocked}</p>
                  <button onClick={() => setView('pricing')} className="bg-[#B38A3B] hover:bg-[#9a7530] text-white font-bold px-6 py-2.5 rounded-xl text-sm">
                    {t.upgradeNow}
                  </button>
                </>
              )}
            </div>
          )}

          {view === 'dashboard' && (
          <>
          {atFreeLimit && (
            <div className="bg-gradient-to-r from-[#B38A3B]/10 to-[#B38A3B]/5 border border-[#B38A3B]/30 rounded-2xl p-4 flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-[220px]">
                <div className="font-bold text-[#0B1F3B] text-sm">{t.limitReached}</div>
                <div className="text-xs text-gray-600 mt-1">{t.limitReachedDesc}</div>
              </div>
              <button onClick={() => setView('pricing')} className="bg-[#B38A3B] hover:bg-[#9a7530] text-white text-sm font-bold px-4 py-2 rounded-lg">
                {t.upgradeNow}
              </button>
            </div>
          )}
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-[#0B1F3B]/5 p-2 rounded-lg text-[#0B1F3B]"><Wallet size={16} /></div>
                  <span className="text-xs text-gray-500 font-medium">{t.totalBudget}</span>
                </div>
                {!editingBudget && <button onClick={() => { setBudgetInput(String(Math.round(toDisplay(totalBudget)))); setEditingBudget(true); }} className="text-[10px] text-[#B38A3B] hover:underline">{t.editBudget}</button>}
              </div>
              {editingBudget ? (
                <div className="flex items-center gap-2">
                  <input type="number" value={budgetInput} onChange={e => setBudgetInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleBudgetSave()} autoFocus className="w-full border border-[#B38A3B] rounded-lg px-2 py-1 text-[#0B1F3B] font-bold text-xl focus:outline-none" />
                  <button onClick={handleBudgetSave} className="text-[#B38A3B] font-bold text-sm">{t.save}</button>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-[#0B1F3B]">{fmtAmount(totalBudget)}</div>
                  <div className="text-[11px] text-gray-400 mt-1">{symbol}</div>
                </>
              )}
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-[#B38A3B]/10 p-2 rounded-lg text-[#B38A3B]"><TrendingUp size={16} /></div>
                <span className="text-xs text-gray-500 font-medium">{t.totalExpenses}</span>
              </div>
              <div className="text-2xl font-bold text-[#0B1F3B]">{fmtAmount(totalExpenses)} <span className="text-sm text-gray-400 font-normal">{symbol}</span></div>
              <div className="mt-2 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-[#B38A3B] transition-all duration-500" style={{ width: `${Math.min(100, totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0)}%` }} />
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                {totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0}% {isRTL ? 'من الميزانية' : 'of budget'}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-lg ${varianceIsPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {varianceIsPositive ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                </div>
                <span className="text-xs text-gray-500 font-medium">{t.variance}</span>
              </div>
              <div className={`text-2xl font-bold ${varianceIsPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                {varianceIsPositive ? '+' : ''}{fmtAmount(variance)} <span className="text-sm font-normal opacity-70">{symbol}</span>
              </div>
              <div className="text-[11px] text-gray-400 mt-1">{varianceIsPositive ? t.underBudget : t.overBudget}</div>
            </div>
            <div className="bg-[#0B1F3B] rounded-2xl p-5 shadow-sm text-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-[#B38A3B] p-2 rounded-lg"><Scale size={16} className="text-white" /></div>
                <span className="text-xs text-gray-300 font-medium">{t.costPerMeter}</span>
              </div>
              <div className="text-2xl font-bold text-[#B38A3B]">{fmtAmount(costPerMeter)} <span className="text-sm font-normal opacity-70">{symbol}</span></div>
              <div className="text-[11px] text-gray-400 mt-1">{symbol}{t.perMeter} · {PROJECT_AREA} م²</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#0B1F3B] font-bold">{t.monthlyCashflow}</h3>
                <span className="text-xs text-gray-400">2026</span>
              </div>
              <LineChart data={monthlyData} months={t.months} />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-[#0B1F3B] font-bold mb-4">{t.expensesByCategory}</h3>
              <div className="flex flex-col items-center gap-4">
                <PieChart data={categoryList.map(c => ({ label: t[c], value: categoryTotals[c], color: categoryChartColors[c] }))} />
                <div className="w-full space-y-2">
                  {categoryList.map(c => {
                    const pct = totalExpenses > 0 ? Math.round((categoryTotals[c] / totalExpenses) * 100) : 0;
                    return (
                      <div key={c} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: categoryChartColors[c] }} />
                          <span className="text-gray-600">{t[c]}</span>
                        </div>
                        <span className="font-bold text-[#0B1F3B]">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Category breakdown table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-[#0B1F3B] font-bold">{t.categoryBreakdown}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="text-start px-6 py-3 font-medium">{t.categoryName}</th>
                    <th className="text-start px-6 py-3 font-medium">{t.totalExpenses}</th>
                    <th className="text-start px-6 py-3 font-medium">{t.percentage}</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryList.map(cat => {
                    const pct = totalExpenses > 0 ? (categoryTotals[cat] / totalExpenses) * 100 : 0;
                    return (
                      <tr key={cat} className="border-t border-gray-100 hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: categoryChartColors[cat] }} />
                            <span className="font-medium text-[#0B1F3B]">{t[cat]}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-[#0B1F3B]">{fmtAmount(categoryTotals[cat])} <span className="text-[11px] text-gray-400 font-normal">{symbol}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 min-w-[140px]">
                            <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden max-w-[120px]">
                              <div className="h-full bg-[#B38A3B]" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="font-bold text-[#0B1F3B] w-10 text-end">{pct.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="border-t border-gray-200 bg-gray-50 font-bold">
                    <td className="px-6 py-4 text-[#0B1F3B]">{t.all}</td>
                    <td className="px-6 py-4 text-[#0B1F3B]">{fmtAmount(totalExpenses)} <span className="text-[11px] text-gray-400 font-normal">{symbol}</span></td>
                    <td className="px-6 py-4 text-[#0B1F3B]">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Ledger (ERP-style grouped tables) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-[#0B1F3B] font-bold text-lg">{t.transactions}</h2>
                {filter.type !== 'all' && (
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Tag size={10} />
                    {filter.type === 'category' ? t[filter.value as Category] : subLabel(filter.value)}
                    <button onClick={() => setFilter({ type: 'all', value: '' })} className="text-[#B38A3B] hover:underline mx-1">×</button>
                  </div>
                )}
              </div>
              <button onClick={openAdd} className="bg-[#B38A3B] hover:bg-[#9a7530] text-white font-bold px-4 py-2 rounded-xl text-sm shadow">
                {t.addExpense}
              </button>
            </div>

            {filteredTx.length === 0 && (
              <div className="text-center text-gray-400 py-12 text-sm">{t.noExpenses}</div>
            )}

            {/* Materials table */}
            {(filter.type !== 'category' || filter.value === 'materials') && txByCategory.materials.length > 0 && (
              <div className="border-t border-gray-100">
                <div className="px-6 py-3 bg-gray-50/80 flex items-center gap-2 text-[#0B1F3B] font-bold text-sm">
                  <Layers size={14} className="text-[#B38A3B]" /> {t.materials}
                  <span className="text-xs text-gray-400 font-normal mx-2">({txByCategory.materials.length})</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white text-gray-500 text-[11px] uppercase border-b border-gray-100">
                      <tr>
                        <th className="text-start px-4 py-2 font-medium whitespace-nowrap">{t.date}</th>
                        <th className="text-start px-4 py-2 font-medium whitespace-nowrap">{t.accountingCode}</th>
                        <th className="text-start px-4 py-2 font-medium whitespace-nowrap">{t.type}</th>
                        <th className="text-start px-4 py-2 font-medium whitespace-nowrap">{t.supplier}</th>
                        <th className="text-start px-4 py-2 font-medium whitespace-nowrap">{t.description}</th>
                        <th className="text-end px-4 py-2 font-medium whitespace-nowrap">{t.quantity}</th>
                        <th className="text-end px-4 py-2 font-medium whitespace-nowrap">{t.totalAmount}</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {txByCategory.materials.map(tx => (
                        <tr key={tx.id} className="border-t border-gray-100 hover:bg-gray-50/60 group">
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{tx.date}</td>
                          <td className="px-4 py-3 font-mono text-xs text-[#0B1F3B] whitespace-nowrap">{tx.accountingCode}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{subLabel(tx.subcategoryId)}</td>
                          <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{tx.supplier}</td>
                          <td className="px-4 py-3 text-gray-700 max-w-[260px] truncate" title={tx.description}>{tx.description}</td>
                          <td className="px-4 py-3 text-gray-600 text-end whitespace-nowrap">{formatNumber(tx.quantity)}</td>
                          <td className="px-4 py-3 text-end font-bold text-[#0B1F3B] whitespace-nowrap">{fmtAmount(tx.amount)} <span className="text-[10px] text-gray-400 font-normal">{symbol}</span></td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEdit(tx)} className="p-1.5 text-gray-400 hover:text-[#B38A3B] hover:bg-[#B38A3B]/5 rounded" title={t.edit}><Pencil size={14} /></button>
                              <button onClick={() => handleDelete(tx.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded" title={t.delete}><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-bold border-t border-gray-200">
                        <td colSpan={6} className="px-4 py-3 text-end text-[#0B1F3B]">{t.total}</td>
                        <td className="px-4 py-3 text-end text-[#0B1F3B]">{fmtAmount(txByCategory.materials.reduce((s, x) => s + x.amount, 0))} <span className="text-[10px] text-gray-400 font-normal">{symbol}</span></td>
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Contracting table */}
            {(filter.type !== 'category' || filter.value === 'contracting') && txByCategory.contracting.length > 0 && (
              <div className="border-t border-gray-100">
                <div className="px-6 py-3 bg-gray-50/80 flex items-center gap-2 text-[#0B1F3B] font-bold text-sm">
                  <Wrench size={14} className="text-[#B38A3B]" /> {t.contracting}
                  <span className="text-xs text-gray-400 font-normal mx-2">({txByCategory.contracting.length})</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white text-gray-500 text-[11px] uppercase border-b border-gray-100">
                      <tr>
                        <th className="text-start px-4 py-2 font-medium whitespace-nowrap">{t.date}</th>
                        <th className="text-start px-4 py-2 font-medium whitespace-nowrap">{t.accountingCode}</th>
                        <th className="text-start px-4 py-2 font-medium whitespace-nowrap">{t.type}</th>
                        <th className="text-start px-4 py-2 font-medium whitespace-nowrap">{t.contractor}</th>
                        <th className="text-start px-4 py-2 font-medium whitespace-nowrap">{t.paymentNumber}</th>
                        <th className="text-start px-4 py-2 font-medium whitespace-nowrap">{t.description}</th>
                        <th className="text-end px-4 py-2 font-medium whitespace-nowrap">{t.amount}</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {txByCategory.contracting.map(tx => (
                        <tr key={tx.id} className="border-t border-gray-100 hover:bg-gray-50/60 group">
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{tx.date}</td>
                          <td className="px-4 py-3 font-mono text-xs text-[#0B1F3B] whitespace-nowrap">{tx.accountingCode}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{subLabel(tx.subcategoryId)}</td>
                          <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{tx.contractor}</td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">{tx.paymentNumber || '—'}</td>
                          <td className="px-4 py-3 text-gray-700 max-w-[260px] truncate" title={tx.description}>{tx.description}</td>
                          <td className="px-4 py-3 text-end font-bold text-[#0B1F3B] whitespace-nowrap">{fmtAmount(tx.amount)} <span className="text-[10px] text-gray-400 font-normal">{symbol}</span></td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEdit(tx)} className="p-1.5 text-gray-400 hover:text-[#B38A3B] hover:bg-[#B38A3B]/5 rounded"><Pencil size={14} /></button>
                              <button onClick={() => handleDelete(tx.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-bold border-t border-gray-200">
                        <td colSpan={6} className="px-4 py-3 text-end text-[#0B1F3B]">{t.total}</td>
                        <td className="px-4 py-3 text-end text-[#0B1F3B]">{fmtAmount(txByCategory.contracting.reduce((s, x) => s + x.amount, 0))} <span className="text-[10px] text-gray-400 font-normal">{symbol}</span></td>
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Services table */}
            {(filter.type !== 'category' || filter.value === 'services') && txByCategory.services.length > 0 && (
              <div className="border-t border-gray-100">
                <div className="px-6 py-3 bg-gray-50/80 flex items-center gap-2 text-[#0B1F3B] font-bold text-sm">
                  <Zap size={14} className="text-[#B38A3B]" /> {t.services}
                  <span className="text-xs text-gray-400 font-normal mx-2">({txByCategory.services.length})</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white text-gray-500 text-[11px] uppercase border-b border-gray-100">
                      <tr>
                        <th className="text-start px-4 py-2 font-medium whitespace-nowrap">{t.date}</th>
                        <th className="text-start px-4 py-2 font-medium whitespace-nowrap">{t.accountingCode}</th>
                        <th className="text-start px-4 py-2 font-medium whitespace-nowrap">{t.type}</th>
                        <th className="text-start px-4 py-2 font-medium whitespace-nowrap">{t.entity}</th>
                        <th className="text-start px-4 py-2 font-medium whitespace-nowrap">{t.receiptNumber}</th>
                        <th className="text-start px-4 py-2 font-medium whitespace-nowrap">{t.description}</th>
                        <th className="text-end px-4 py-2 font-medium whitespace-nowrap">{t.amount}</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {txByCategory.services.map(tx => (
                        <tr key={tx.id} className="border-t border-gray-100 hover:bg-gray-50/60 group">
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{tx.date}</td>
                          <td className="px-4 py-3 font-mono text-xs text-[#0B1F3B] whitespace-nowrap">{tx.accountingCode}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{subLabel(tx.subcategoryId)}</td>
                          <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{tx.entity}</td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">{tx.receiptNumber || '—'}</td>
                          <td className="px-4 py-3 text-gray-700 max-w-[260px] truncate" title={tx.description}>{tx.description}</td>
                          <td className="px-4 py-3 text-end font-bold text-[#0B1F3B] whitespace-nowrap">{fmtAmount(tx.amount)} <span className="text-[10px] text-gray-400 font-normal">{symbol}</span></td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEdit(tx)} className="p-1.5 text-gray-400 hover:text-[#B38A3B] hover:bg-[#B38A3B]/5 rounded"><Pencil size={14} /></button>
                              <button onClick={() => handleDelete(tx.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-bold border-t border-gray-200">
                        <td colSpan={6} className="px-4 py-3 text-end text-[#0B1F3B]">{t.total}</td>
                        <td className="px-4 py-3 text-end text-[#0B1F3B]">{fmtAmount(txByCategory.services.reduce((s, x) => s + x.amount, 0))} <span className="text-[10px] text-gray-400 font-normal">{symbol}</span></td>
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          </>
          )}
        </main>
      </div>

      {/* Add / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 animate-fade-in max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#0B1F3B] font-bold text-xl">{editingId ? t.editExpense : t.addNewExpense}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400"><X size={20} /></button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t.category}</label>
                <select
                  value={form.category}
                  onChange={e => onCategoryChange(e.target.value as Category)}
                  disabled={!!editingId}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[#0B1F3B] focus:outline-none focus:border-[#B38A3B] bg-white disabled:bg-gray-50 disabled:text-gray-500"
                >
                  {categoryList.map(c => <option key={c} value={c}>{t[c]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t.subcategory}</label>
                <select
                  value={form.subcategoryId}
                  onChange={e => setForm(f => ({ ...f, subcategoryId: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[#0B1F3B] focus:outline-none focus:border-[#B38A3B] bg-white"
                >
                  {subsByCategory[form.category].map(s => <option key={s.id} value={s.id}>{s[lang]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t.date}</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[#0B1F3B] focus:outline-none focus:border-[#B38A3B]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t.accountingCode}</label>
                <input type="text" value={form.accountingCode} onChange={e => setForm(f => ({ ...f, accountingCode: e.target.value }))} placeholder="MAT-1001" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[#0B1F3B] focus:outline-none focus:border-[#B38A3B] font-mono" />
              </div>

              {form.category === 'materials' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t.supplier}</label>
                    <input type="text" value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[#0B1F3B] focus:outline-none focus:border-[#B38A3B]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t.quantity}</label>
                    <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} min="0" step="0.01" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[#0B1F3B] focus:outline-none focus:border-[#B38A3B]" />
                  </div>
                </>
              )}

              {form.category === 'contracting' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t.contractor}</label>
                    <input type="text" value={form.contractor} onChange={e => setForm(f => ({ ...f, contractor: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[#0B1F3B] focus:outline-none focus:border-[#B38A3B]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t.paymentNumber}</label>
                    <input type="text" value={form.paymentNumber} onChange={e => setForm(f => ({ ...f, paymentNumber: e.target.value }))} placeholder="PAY-001" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[#0B1F3B] focus:outline-none focus:border-[#B38A3B] font-mono" />
                  </div>
                </>
              )}

              {form.category === 'services' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t.entity}</label>
                    <input type="text" value={form.entity} onChange={e => setForm(f => ({ ...f, entity: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[#0B1F3B] focus:outline-none focus:border-[#B38A3B]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t.receiptNumber}</label>
                    <input type="text" value={form.receiptNumber} onChange={e => setForm(f => ({ ...f, receiptNumber: e.target.value }))} placeholder="RCP-001" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[#0B1F3B] focus:outline-none focus:border-[#B38A3B] font-mono" />
                  </div>
                </>
              )}

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">{t.description}</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[#0B1F3B] focus:outline-none focus:border-[#B38A3B] resize-none" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">{form.category === 'materials' ? t.totalAmount : t.amount} ({symbol})</label>
                <div className="relative">
                  <span className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-[#B38A3B] font-bold pointer-events-none`}>{symbol}</span>
                  <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} min="0" step="0.01" className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isRTL ? 'pl-12' : 'pr-12'} text-[#0B1F3B] focus:outline-none focus:border-[#B38A3B] text-lg font-bold`} />
                </div>
              </div>
            </div>

            {formError && <div className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2 mt-4">{formError}</div>}

            <div className="flex gap-3 pt-6">
              <button onClick={handleSave} className="flex-1 bg-[#B38A3B] hover:bg-[#9a7530] text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2">
                <Plus size={18} /> {t.save}
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl">
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {upgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#B38A3B]/10 text-[#B38A3B] rounded-xl flex items-center justify-center">
                <TrendingUp size={22} />
              </div>
              <button onClick={() => setUpgradeModalOpen(false)} className="text-gray-400"><X size={20} /></button>
            </div>
            <h3 className="text-[#0B1F3B] font-bold text-xl mb-2">{t.limitReached}</h3>
            <p className="text-gray-500 text-sm mb-6">{t.limitReachedDesc}</p>
            <div className="flex gap-3">
              <button onClick={() => { setUpgradeModalOpen(false); setView('pricing'); }} className="flex-1 bg-[#B38A3B] hover:bg-[#9a7530] text-white font-bold py-2.5 rounded-xl">
                {t.upgradeNow}
              </button>
              <button onClick={() => setUpgradeModalOpen(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl">
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {checkoutPlan && (() => {
        const selected = PLANS.find(p => p.id === checkoutPlan)!;
        const displayAmount = Math.max(1, Math.round(toDisplay(selected.priceSAR)));
        const accountNumber = '___________';
        const iban = 'SA__ ____ ____ ____ ____ ____';
        const bankName = 'stc bank';
        const copy = (text: string) => navigator.clipboard?.writeText(text).catch(() => {});
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
              {paymentStatus === 'success' ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 text-[#B38A3B] flex items-center justify-center mb-4">
                    <Clock size={30} />
                  </div>
                  <h3 className="text-[#0B1F3B] font-bold text-xl mb-2">
                    {isRTL ? 'تم استلام طلبك' : 'Request received'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {isRTL ? 'سيتم تفعيل اشتراكك خلال وقت قصير' : 'Your subscription will be activated shortly'}
                  </p>
                  <div className="inline-flex items-center gap-2 text-[11px] bg-amber-50 text-[#B38A3B] px-3 py-1 rounded-full font-bold mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B38A3B] animate-pulse" />
                    {isRTL ? 'في انتظار التفعيل' : 'Pending Activation'}
                  </div>
                  <button
                    onClick={() => { setCheckoutPlan(null); setPaymentStatus('idle'); }}
                    className="w-full bg-[#0B1F3B] hover:bg-[#1a3560] text-white font-bold py-2.5 rounded-xl"
                  >
                    {t.done}
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-br from-[#0B1F3B] to-[#1a3560] text-white p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <Shield size={12} /> {isRTL ? 'تحويل بنكي آمن' : 'Secure bank transfer'}
                      </div>
                      <button onClick={() => { setCheckoutPlan(null); setPaymentStatus('idle'); }} className="text-white/60 hover:text-white"><X size={18} /></button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Landmark size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold leading-tight">{isRTL ? 'الدفع عبر stc bank' : 'Pay via stc bank'}</h3>
                        <div className="text-xs text-white/60">{selected[lang]} · {displayAmount.toLocaleString('en-US')} {symbol}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">{t.orderSummary}</div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-[#0B1F3B]">{selected[lang]} · {isRTL ? 'اشتراك شهري' : 'Monthly'}</div>
                        <div className="font-bold text-[#B38A3B]">{displayAmount.toLocaleString('en-US')} {symbol}</div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-xs text-gray-500">{isRTL ? 'اسم البنك' : 'Bank Name'}</span>
                        <span className="font-bold text-[#0B1F3B]">{bankName}</span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3 gap-3">
                        <span className="text-xs text-gray-500 flex-shrink-0">{isRTL ? 'رقم الحساب' : 'Account Number'}</span>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-sm text-[#0B1F3B] truncate" dir="ltr">{accountNumber}</span>
                          <button onClick={() => copy(accountNumber)} className="text-gray-400 hover:text-[#B38A3B] flex-shrink-0" title={isRTL ? 'نسخ' : 'Copy'}>
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3 gap-3">
                        <span className="text-xs text-gray-500 flex-shrink-0">{isRTL ? 'الآيبان' : 'IBAN'}</span>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-sm text-[#0B1F3B] truncate" dir="ltr">{iban}</span>
                          <button onClick={() => copy(iban)} className="text-gray-400 hover:text-[#B38A3B] flex-shrink-0" title={isRTL ? 'نسخ' : 'Copy'}>
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-xs text-gray-500">{isRTL ? 'المبلغ' : 'Amount'}</span>
                        <span className="font-bold text-[#B38A3B]">{displayAmount.toLocaleString('en-US')} {symbol}</span>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-[13px] text-amber-900 leading-relaxed" dir={isRTL ? 'rtl' : 'ltr'}>
                      {isRTL ? 'قم بالتحويل ثم اضغط تأكيد' : 'Transfer the amount, then tap confirm'}
                    </div>

                    <button
                      onClick={() => {
                        setPendingPlan(checkoutPlan);
                        setPaymentStatus('success');
                      }}
                      className="w-full bg-[#B38A3B] hover:bg-[#9a7530] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={18} />
                      {isRTL ? 'تم الدفع' : 'Payment Completed'}
                    </button>

                    <div className="text-center">
                      <button onClick={() => { setCheckoutPlan(null); setPaymentStatus('idle'); }} className="text-xs text-gray-400 hover:text-gray-600">
                        {t.cancel}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
