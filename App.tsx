
import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "https://esm.sh/framer-motion@^12.23.9";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "https://esm.sh/recharts@^3.1.0";
import { GoogleGenAI } from "https://esm.sh/@google/genai@^1.11.0";

// --- From types.ts ---
interface FormData {
    industry: number;
    revenue: number;
    teamSize: number;
    hourlyCost: number;
    leadGenHours: number;
    followUpHours: number;
    dataEntryHours: number;
    schedulingHours: number;
    reportingHours: number;
    emailHours: number;
}

interface CalculationResults {
    totalMonthlyHours: number;
    monthlyWastedCost: number;
    hoursAutomated: number;
    monthlySavings: number;
    productivityGain: number;
    monthlyRevenueBoost: number;
    roi: number;
}

interface StepProps {
    data: FormData;
    updateData: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
    motionProps: any;
}

interface SliderProps {
    id: keyof FormData;
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// --- From constants.ts ---
const INDUSTRY_OPTIONS = [
    { label: "General Business", value: 1.0 },
    { label: "Professional Services", value: 1.3 },
    { label: "E-commerce", value: 1.2 },
    { label: "Real Estate", value: 1.4 },
    { label: "Healthcare", value: 1.5 },
    { label: "Technology", value: 1.3 },
    { label: "Manufacturing", value: 1.2 },
    { label: "Financial Services", value: 1.6 },
    { label: "Marketing Agency", value: 1.4 },
];

const INITIAL_FORM_DATA: FormData = {
    industry: 1.0,
    revenue: 250000,
    teamSize: 15,
    hourlyCost: 95,
    leadGenHours: 20,
    followUpHours: 16,
    dataEntryHours: 12,
    schedulingHours: 8,
    reportingHours: 6,
    emailHours: 10,
};

const TOTAL_STEPS = 3;
const SERVICE_COST = 7500;
const BOOKING_URL = "https://calendly.com/d/cn3-2j9-8c9/30-minute-meeting";
const PIE_CHART_COLORS = ["#10B981", "#3b82f6", "#f59e0b", "#ef4444", "#a855f7", "#6366f1"];

// --- From components/icons.tsx ---
type IconProps = { className?: string; };
const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>);
const SparkleIcon: React.FC<IconProps> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"></path></svg>);
const ArrowLeftIcon: React.FC<IconProps> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>);
const XIcon: React.FC<IconProps> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const RobotIcon: React.FC<IconProps> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 8V4H8V8H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2Z"></path><path d="M9 12h6"></path><circle cx="9" cy="16" r="1"></circle><circle cx="15" cy="16" r="1"></circle><path d="M12 4a2 2 0 1 0-4 0v4h4Z"></path></svg>);
const CalendarIcon: React.FC<IconProps> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>);
const TrendUpIcon: React.FC<IconProps> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>);
const ClockIcon: React.FC<IconProps> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>);
const CurrencyDollarIcon: React.FC<IconProps> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>);
const ChartBarIcon: React.FC<IconProps> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 3v18h18"></path><path d="M7 16V8"></path><path d="M12 16V4"></path><path d="M17 16v-4"></path></svg>);

// --- From services/geminiService.ts ---
const parseInsights = (text: string): string[] => text.split("\n").map((line) => line.trim().replace(/^\s*[-*]\s*/, "")).filter((line) => line.length > 0);
const generateInsights = async (data: FormData, apiKey: string): Promise<string[]> => {
    try {
        if (!apiKey) { throw new Error("API key is missing."); }
        const ai = new GoogleGenAI({ apiKey });
        const industryName = INDUSTRY_OPTIONS.find((opt) => opt.value === data.industry)?.label || "General Business";
        const totalWeeklyHours = data.leadGenHours + data.followUpHours + data.dataEntryHours + data.schedulingHours + data.reportingHours + data.emailHours;
        const prompt = `
            You are a world-class business automation consultant. A potential client from the "${industryName}" industry has provided data from an ROI calculator.
            Your task is to generate 3 short, compelling, and actionable bullet points (using markdown) that highlight the most impactful benefits of AI automation for them.
            
            **Instructions:**
            1.  **Be Persuasive & Benefit-Oriented:** Frame each point around a tangible business outcome.
            2.  **Use Specific Data:** Weave in the client's data to make your points concrete and personalized.
            3.  **Keep it Concise:** Each bullet point should be a single, powerful sentence.
            4.  **Format:** Start each line with a hyphen (-). Do not include any introductory or concluding text. Bold key phrases using **bold**.
            
            **Client Data:**
            - Industry: ${industryName}
            - Monthly Revenue: $${data.revenue.toLocaleString()}
            - Team Size: ${data.teamSize}
            - Total manual hours per week: ${totalWeeklyHours} hours
            - Tasks & Hours/Week: Lead Generation: ${data.leadGenHours} hrs, Follow-ups: ${data.followUpHours} hrs, Data Entry: ${data.dataEntryHours} hrs, Scheduling: ${data.schedulingHours} hrs

            **Example Output:**
            - Reclaim **${data.leadGenHours + data.followUpHours} hours/week** from lead generation and follow-ups to let your sales team focus exclusively on closing deals.
            - Eliminate **${data.dataEntryHours + data.schedulingHours} hours/week** of tedious administrative work, boosting team morale and unlocking time for high-value planning.
            - Enhance your client experience by automating routine communications, ensuring lightning-fast responses that build loyalty.
        `;
        const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
        return parseInsights(response.text);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to communicate with the AI service. Please check your API key and try again.");
    }
};

// --- Sub-components ---
const AnimatedCounter: React.FC<{ from?: number; to: number; prefix?: string; suffix?: string; }> = ({ from = 0, to, prefix = "", suffix = "" }) => {
    const count = useMotionValue(from);
    const rounded = useTransform(count, (latest) => `${prefix}${Math.round(latest).toLocaleString()}${suffix}`);
    React.useEffect(() => { const controls = animate(count, to, { duration: 1.5, ease: "easeOut" }); return controls.stop; }, [to, count]);
    return <motion.span>{rounded}</motion.span>;
};

const Slider: React.FC<SliderProps> = ({ id, label, value, min, max, step = 1, unit = "", onChange }) => {
    const percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;
    const sliderStyle: React.CSSProperties = { background: `linear-gradient(to right, #10B981 ${percentage}%, #e2e8f0 ${percentage}%)` };
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <label htmlFor={id.toString()} className="text-sm font-medium text-slate-600">{label}</label>
                <span className="text-sm font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-700">{unit}{value.toLocaleString()}</span>
            </div>
            <input type="range" id={id.toString()} name={id.toString()} min={min} max={max} step={step} value={value} onChange={onChange} style={sliderStyle} className="w-full h-2.5 bg-slate-200 rounded-full appearance-none cursor-pointer slider-track" />
        </div>
    );
};

const RoiBarChart: React.FC<{ data: { name: string; Cost: number; fill: string }[] }> = ({ data }) => (
    <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
            <YAxis tickFormatter={(tick) => `$${(tick / 1000).toLocaleString()}k`} tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} formatter={(value: number) => [new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value), 'Cost']} />
            <Legend wrapperStyle={{ fontSize: '14px', color: '#334155' }} />
            <Bar dataKey="Cost" radius={[4, 4, 0, 0]} />
        </BarChart>
    </ResponsiveContainer>
);

const RoiPieChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
    const total = data.reduce((acc, d) => acc + d.value, 0);
    if (total === 0) return <div className="w-full h-[250px] flex items-center justify-center text-slate-500">No time entries to display.</div>;
    return (
        <div className="w-full h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" fill="#8884d8" paddingAngle={5} dataKey="value">{data.map((_, i) => <Cell key={`cell-${i}`} fill={PIE_CHART_COLORS[i % PIE_CHART_COLORS.length]} />)}</Pie><Tooltip formatter={(v: number) => [`${v} hrs/week`, 'Time']} /><Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px' }} /></PieChart></ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="text-center"><p className="text-3xl font-bold text-slate-800">{total}</p><p className="text-xs text-slate-500">Total hrs/week</p></div></div>
        </div>
    );
};

const InsightSkeleton: React.FC = () => (
    <div className="mt-6 p-6 bg-slate-100 rounded-xl border border-emerald-500/30 animate-pulse">
        <div className="flex items-center gap-2 mb-4"><SparkleIcon className="text-emerald-500" /><div className="h-5 w-3/4 bg-slate-200 rounded"></div></div>
        <div className="space-y-3">{[...Array(3)].map((_, i) => (<div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg"><div className="w-5 h-5 rounded-full bg-slate-200 flex-shrink-0 mt-1"></div><div className="h-4 bg-slate-200 rounded w-full flex-grow"></div></div>))}</div>
    </div>
);

const Step1: React.FC<StepProps> = ({ data, updateData, motionProps }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { updateData(e.target.id as keyof typeof data, parseFloat(e.target.value)); };
    return (<motion.div {...motionProps} className="space-y-8"><div className="text-center"><h3 className="text-xl font-bold text-slate-900">Tell us about your business</h3><p className="text-slate-500 mt-1">This helps us tailor the calculation to you.</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"><label htmlFor="industry" className="block text-sm font-medium text-slate-600 mb-2">Industry</label><select id="industry" value={data.industry} onChange={handleInputChange} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2.5 px-3 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition">{INDUSTRY_OPTIONS.map((opt) => (<option key={opt.label} value={opt.value}>{opt.label}</option>))}</select></div><div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"><Slider id="revenue" label="Monthly Revenue" value={data.revenue} min={10000} max={1000000} step={10000} unit="$" onChange={handleInputChange} /></div><div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"><Slider id="teamSize" label="Team Size" value={data.teamSize} min={1} max={100} onChange={handleInputChange} /></div><div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"><Slider id="hourlyCost" label="Average Hourly Cost" value={data.hourlyCost} min={10} max={250} unit="$" onChange={handleInputChange} /></div></div></motion.div>);
};

const Step2: React.FC<StepProps> = ({ data, updateData, motionProps }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { updateData(e.target.id as keyof typeof data, parseFloat(e.target.value)); };
    const tasks = [{ id: "leadGenHours", label: "Lead Generation", min: 0, max: 50 }, { id: "followUpHours", label: "Customer Follow-ups", min: 0, max: 40 }, { id: "dataEntryHours", label: "Data Entry & Admin", min: 0, max: 30 }, { id: "schedulingHours", label: "Scheduling & Coordination", min: 0, max: 25 }, { id: "reportingHours", label: "Reporting & Analytics", min: 0, max: 20 }, { id: "emailHours", label: "Email Management", min: 0, max: 25 },];
    const totalWeeklyHours = tasks.reduce((sum, task) => sum + (data[task.id as keyof typeof data] as number), 0);
    return (<motion.div {...motionProps} className="space-y-8"><div className="text-center"><h3 className="text-xl font-bold text-slate-900">Analyze Manual Processes</h3><p className="text-slate-500 mb-4 mt-1">Estimate hours per week your team spends on these tasks.</p><div className="inline-block bg-emerald-100 text-emerald-800 font-semibold py-2 px-5 rounded-full transition-all duration-300">Total Weekly Hours: <span className="font-bold">{totalWeeklyHours}</span></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{tasks.map((task) => (<div key={task.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"><Slider id={task.id as keyof typeof data} label={`${task.label} (hrs/week)`} value={data[task.id as keyof typeof data] as number} min={task.min} max={task.max} onChange={handleInputChange} /></div>))}</div></motion.div>);
};

interface Step3Props { results: CalculationResults; formData: FormData; apiKey: string; motionProps: any; }
const Step3: React.FC<Step3Props> = ({ results, formData, apiKey, motionProps }) => {
    const [insights, setInsights] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [view, setView] = React.useState<'results' | 'booking'>('results');

    const handleGenerateInsights = React.useCallback(async () => { setIsLoading(true); setError(""); try { const gen = await generateInsights(formData, apiKey); setInsights(gen); } catch (e) { setError(e instanceof Error ? e.message : "An unknown error occurred."); console.error(e); } finally { setIsLoading(false); } }, [formData, apiKey]);
    const calendlyUrl = React.useMemo(() => { try { const url = new URL(BOOKING_URL); url.searchParams.append("hide_event_type_details", "1"); url.searchParams.append("hide_gdpr_banner", "1"); url.searchParams.append("background_color", "f8fafc"); url.searchParams.append("text_color", "1e293b"); url.searchParams.append("primary_color", "10B981"); return url.toString(); } catch (e) { return ""; } }, []);
    const costData = React.useMemo(() => [{ name: "Manual Cost", Cost: results.monthlyWastedCost, fill: "#94a3b8" }, { name: "After AI", Cost: results.monthlyWastedCost - results.monthlySavings, fill: "#10B981" }], [results]);
    const timeData = React.useMemo(() => [{ name: "Lead Gen", value: formData.leadGenHours }, { name: "Follow-ups", value: formData.followUpHours }, { name: "Data Entry", value: formData.dataEntryHours }, { name: "Scheduling", value: formData.schedulingHours }, { name: "Reporting", value: formData.reportingHours }, { name: "Email Mgmt", value: formData.emailHours },].filter(d => d.value > 0), [formData]);
    const metricCards = [{ id: "moneySaved", value: results.monthlySavings, label: "Monthly Cost Savings", prefix: "$", icon: CurrencyDollarIcon, highlight: true }, { id: "revenueBoost", value: results.monthlyRevenueBoost, label: "Add. Revenue Potential", prefix: "$", icon: TrendUpIcon, highlight: true }, { id: "timeSaved", value: results.hoursAutomated, label: "Hours Automated/Month", suffix: " hrs", icon: ClockIcon, highlight: false }, { id: "productivityGain", value: results.productivityGain, label: "Productivity Increase", suffix: "%", icon: ChartBarIcon, highlight: false }];
    const renderInsight = (line: string) => line.split(/(\*\*.*?\*\*)/g).map((part, index) => part.startsWith('**') && part.endsWith('**') ? <strong key={index} className="text-slate-900">{part.slice(2, -2)}</strong> : part);

    return (<motion.div {...motionProps}><AnimatePresence mode="wait">{view === 'results' ? (<motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}><div className="text-center mb-8"><h3 className="text-2xl font-bold text-slate-900">Your Automation ROI Potential</h3><p className="text-slate-500 mt-1">Here's how AI can transform your business.</p></div><div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-10 text-center shadow-lg shadow-emerald-500/10 mb-8 relative overflow-hidden"><div className="absolute -inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_60%)]"></div><div className="relative"><h4 className="text-lg font-medium text-emerald-700 mb-2 tracking-wide uppercase">First-Year ROI</h4><div className="text-6xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-700 tracking-tighter"><AnimatedCounter to={results.roi === Infinity ? 10000 : results.roi} />%</div></div></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">{metricCards.map(m => (<div key={m.id} className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm"><m.icon className={`mx-auto mb-2 ${m.highlight ? 'text-emerald-500' : 'text-emerald-500'}`} /><div className="text-2xl md:text-3xl font-bold text-slate-800"><AnimatedCounter to={m.value} prefix={m.prefix} suffix={m.suffix} /></div><div className="text-xs text-slate-500 mt-1">{m.label}</div></div>))}</div><div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"><div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200"><h4 className="font-bold text-slate-800 mb-4 text-center text-lg">Monthly Cost: Manual vs. Automated</h4><RoiBarChart data={costData} /></div><div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200"><h4 className="font-bold text-slate-800 mb-4 text-center text-lg">Weekly Hours on Manual Tasks</h4><RoiPieChart data={timeData} /></div></div><div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">{insights.length === 0 && !isLoading && !error && (<div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left"><div className="flex-shrink-0"><RobotIcon className="text-slate-500" /></div><div className="flex-grow"><h4 className="font-bold text-lg text-slate-800">Ready for the Next Step?</h4><p className="text-slate-500">Generate your personalized AI strategy, or book a free call.</p></div><div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 mt-4 md:mt-0 w-full sm:w-auto"><button onClick={handleGenerateInsights} disabled={isLoading} className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center justify-center gap-2"><SparkleIcon /> Generate AI Insights</button><button onClick={() => setView('booking')} className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center justify-center gap-2"><CalendarIcon /> Book a Consultation</button></div></div>)}{isLoading && <InsightSkeleton />}{error && <div className="text-center text-red-600 p-4"><p>{error}</p><button onClick={handleGenerateInsights} className="mt-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-md">Try Again</button></div>}{insights.length > 0 && !isLoading && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><div className="mb-8"><h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg"><SparkleIcon className="text-emerald-500" />Your Personalized Automation Strategy:</h5><div className="space-y-3">{insights.map((line, i) => (<div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200"><CheckCircleIcon className="flex-shrink-0 text-emerald-500 mt-1" /><p className="flex-grow text-slate-700">{renderInsight(line)}</p></div>))}</div></div><div className="border-t border-slate-200 pt-6"><div className="flex flex-col md:flex-row items-center gap-6"><div className="flex-grow text-center md:text-left"><h4 className="font-bold text-lg text-slate-800">Ready to unlock these results?</h4><p className="text-slate-500">Schedule a free consultation to get a detailed automation roadmap.</p></div><div className="flex-shrink-0 w-full md:w-auto"><button onClick={() => setView('booking')} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center justify-center gap-2"><CalendarIcon /> Book a Free Consultation</button></div></div></div></motion.div>)}</div></motion.div>) : (<motion.div key="booking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}><div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4"><h3 className="text-xl sm:text-2xl font-bold text-slate-900 text-center sm:text-left">Schedule Your Consultation</h3><button onClick={() => setView('results')} className="flex items-center justify-center gap-2 w-full sm:w-auto text-slate-600 hover:text-slate-900 font-semibold py-2.5 px-5 rounded-full bg-slate-200 hover:bg-slate-300 transition-all"><ArrowLeftIcon /> Back to Results</button></div><div className="rounded-xl overflow-hidden border border-slate-200 h-[650px] sm:h-[700px] bg-white">{calendlyUrl ? (<iframe src={calendlyUrl} width="100%" height="100%" frameBorder="0" title="Schedule a meeting"></iframe>) : (<div className="w-full h-full flex items-center justify-center text-red-500">Invalid booking URL.</div>)}</div></motion.div>)}</AnimatePresence></motion.div>);
};

// --- Main Calculator UI Logic ---
interface CalculatorUIProps { apiKey: string; onClose: () => void; }
const CalculatorUI: React.FC<CalculatorUIProps> = ({ apiKey, onClose }) => {
    const [currentStep, setCurrentStep] = React.useState(1);
    const [formData, setFormData] = React.useState<FormData>(INITIAL_FORM_DATA);
    const [direction, setDirection] = React.useState(1);

    const updateData = React.useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => { setFormData(prev => ({ ...prev, [key]: value })); }, []);
    const results: CalculationResults | null = React.useMemo(() => {
        if (currentStep !== TOTAL_STEPS) return null;
        const { teamSize, hourlyCost, industry, revenue, ...hours } = formData;
        const totalWeeklyHours = Object.values(hours).reduce((sum, h) => sum + (h as number), 0);
        const totalMonthlyHours = totalWeeklyHours * 4.33;
        const monthlyWastedCost = totalMonthlyHours * hourlyCost;
        const automationPotential = 0.85;
        const hoursAutomated = totalMonthlyHours * automationPotential;
        const monthlySavings = hoursAutomated * hourlyCost;
        const productivityGain = Math.round(((hoursAutomated / totalMonthlyHours) * 100) || 0);
        const revenueBoostMultiplier = (industry - 1.0) * 0.1 + 0.05;
        const monthlyRevenueBoost = monthlySavings * revenueBoostMultiplier + (revenue * 0.01);
        const totalMonthlyValue = monthlySavings + monthlyRevenueBoost;
        const yearlyValue = totalMonthlyValue * 12;
        const roi = SERVICE_COST > 0 ? Math.round(((yearlyValue - SERVICE_COST) / SERVICE_COST) * 100) : Infinity;
        return { totalMonthlyHours, monthlyWastedCost, hoursAutomated: Math.round(hoursAutomated), monthlySavings: Math.round(monthlySavings), productivityGain, monthlyRevenueBoost: Math.round(monthlyRevenueBoost), roi };
    }, [currentStep, formData]);

    const nextStep = () => { setDirection(1); if (currentStep < TOTAL_STEPS) { setCurrentStep(p => p + 1); } };
    const prevStep = () => { setDirection(-1); if (currentStep > 1) { setCurrentStep(p => p - 1); } };
    const stepMotionProps = { initial: { opacity: 0, x: direction * 30 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -direction * 30 }, transition: { duration: 0.4, ease: "easeInOut" } };

    return (
        <div className="bg-white border border-slate-200/50 rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl lg:max-w-4xl flex flex-col overflow-hidden text-slate-800 my-8 max-h-[90vh]">
            <header className="p-4 sm:p-6 text-center border-b border-slate-200 relative">
                <h1 id="roi-calculator-title" className="text-xl sm:text-2xl font-bold text-slate-900">Your Personalized ROI Analysis</h1>
                <p className="text-sm sm:text-base text-slate-500 mt-1">Just a few steps to quantify your potential.</p>
                <button onClick={onClose} aria-label="Close calculator" className="absolute top-3 right-3 p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-all"><XIcon /></button>
            </header>
            <div className="px-4 sm:px-8 pt-6"><div className="w-full bg-slate-200 rounded-full h-2"><motion.div className="bg-emerald-500 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }} transition={{ duration: 0.5, ease: "easeInOut" }} /></div></div>
            <main className="flex-grow overflow-y-auto p-4 sm:px-8 sm:py-10 bg-white"><AnimatePresence mode="wait">{currentStep === 1 && <Step1 key="step1" data={formData} updateData={updateData} motionProps={stepMotionProps} />}{currentStep === 2 && <Step2 key="step2" data={formData} updateData={updateData} motionProps={stepMotionProps} />}{currentStep === 3 && results && <Step3 key="step3" results={results} formData={formData} apiKey={apiKey} motionProps={stepMotionProps} />}</AnimatePresence></main>
            {currentStep < TOTAL_STEPS && (<footer className="p-4 sm:p-6 border-t border-slate-200 flex justify-between items-center bg-slate-50"><button onClick={prevStep} disabled={currentStep === 1} className="p-3 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"><ArrowLeftIcon /></button><button onClick={nextStep} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-full shadow-md shadow-emerald-500/20 transform hover:-translate-y-0.5 transition-all">{currentStep === TOTAL_STEPS - 1 ? "Calculate ROI" : "Next Step"}</button></footer>)}
        </div>
    );
};

// --- Exported Popup Component for Framer ---
export interface AIROICalculatorPopupProps {
    isOpen: boolean;
    onClose: () => void;
    apiKey: string;
}

export const AIROICalculatorPopup: React.FC<AIROICalculatorPopupProps> = ({ isOpen, onClose, apiKey }) => {
    React.useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="roi-calculator-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 selection:bg-emerald-500/30"
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="relative"
                    >
                         <CalculatorUI apiKey={apiKey} onClose={onClose} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AIROICalculatorPopup;
