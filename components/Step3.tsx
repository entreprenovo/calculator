
import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalculationResults, FormData } from '../types';
import { generateInsights } from '../services/geminiService';
import { BOOKING_URL, PIE_CHART_COLORS } from '../constants';
import AnimatedCounter from './AnimatedCounter';
import RoiBarChart from './RoiBarChart';
import RoiPieChart from './RoiPieChart';
import InsightSkeleton from './InsightSkeleton';
import { ArrowLeftIcon, CalendarIcon, ChartBarIcon, CheckCircleIcon, ClockIcon, CurrencyDollarIcon, RobotIcon, SparkleIcon, TrendUpIcon } from './icons';

interface Step3Props {
    results: CalculationResults;
    formData: FormData;
    motionProps: any;
}

const Step3: React.FC<Step3Props> = ({ results, formData, motionProps }) => {
    const [insights, setInsights] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [view, setView] = useState<'results' | 'booking'>('results');

    const handleGenerateInsights = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const generated = await generateInsights(formData);
            setInsights(generated);
        } catch (e) {
            setError("Failed to generate insights. Please try again.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [formData]);

    const calendlyUrl = useMemo(() => {
        try {
            const url = new URL(BOOKING_URL);
            url.searchParams.append("hide_event_type_details", "1");
            url.searchParams.append("hide_gdpr_banner", "1");
            url.searchParams.append("background_color", "f8fafc");
            url.searchParams.append("text_color", "1e293b");
            url.searchParams.append("primary_color", "10B981");
            return url.toString();
        } catch (e) {
            console.error("Invalid booking URL", e);
            return "";
        }
    }, []);

    const costData = useMemo(() => [
        { name: "Manual Cost", Cost: results.monthlyWastedCost, fill: "#94a3b8" },
        { name: "After AI", Cost: results.monthlyWastedCost - results.monthlySavings, fill: "#10B981" }
    ], [results]);

    const timeData = useMemo(() => [
        { name: "Lead Gen", value: formData.leadGenHours },
        { name: "Follow-ups", value: formData.followUpHours },
        { name: "Data Entry", value: formData.dataEntryHours },
        { name: "Scheduling", value: formData.schedulingHours },
        { name: "Reporting", value: formData.reportingHours },
        { name: "Email Mgmt", value: formData.emailHours },
    ].filter(d => d.value > 0), [formData]);
    
    const metricCards = [
        { id: "moneySaved", value: results.monthlySavings, label: "Monthly Cost Savings", prefix: "$", icon: CurrencyDollarIcon, highlight: true },
        { id: "revenueBoost", value: results.monthlyRevenueBoost, label: "Add. Revenue Potential", prefix: "$", icon: TrendUpIcon, highlight: true },
        { id: "timeSaved", value: results.hoursAutomated, label: "Hours Automated/Month", suffix: " hrs", icon: ClockIcon, highlight: false },
        { id: "productivityGain", value: results.productivityGain, label: "Productivity Increase", suffix: "%", icon: ChartBarIcon, highlight: false },
    ];

    const renderInsight = (line: string) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="text-slate-900">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <motion.div {...motionProps}>
            <AnimatePresence mode="wait">
                {view === 'results' ? (
                    <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-slate-900">Your Automation ROI Potential</h3>
                            <p className="text-slate-500 mt-1">Here's how AI automation can transform your business.</p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-10 text-center shadow-lg shadow-emerald-500/10 mb-8 relative overflow-hidden">
                             <div className="absolute -inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_60%)]"></div>
                            <div className="relative">
                                <h4 className="text-lg font-medium text-emerald-700 mb-2 tracking-wide uppercase">First-Year Return on Investment</h4>
                                <div className="text-6xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-700 tracking-tighter">
                                    <AnimatedCounter to={results.roi === Infinity ? 10000 : results.roi} />%
                                </div>
                                <p className="mt-2 text-slate-600 max-w-md mx-auto">Based on your inputs, this is your potential ROI after implementing our AI solutions.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {metricCards.map(metric => {
                                const Icon = metric.icon;
                                return (
                                    <div key={metric.id} className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-300">
                                        <Icon className={`mx-auto mb-2 ${metric.highlight ? 'text-emerald-500' : 'text-emerald-500'}`} />
                                        <div className="text-2xl md:text-3xl font-bold text-slate-800">
                                            <AnimatedCounter to={metric.value} prefix={metric.prefix} suffix={metric.suffix} />
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">{metric.label}</div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200"><h4 className="font-bold text-slate-800 mb-4 text-center text-lg">Monthly Cost: Manual vs. Automated</h4><RoiBarChart data={costData} /></div>
                            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200"><h4 className="font-bold text-slate-800 mb-4 text-center text-lg">Weekly Hours on Manual Tasks</h4><RoiPieChart data={timeData} /></div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                            {insights.length === 0 && !isLoading && !error && (
                                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                    <div className="flex-shrink-0"><RobotIcon className="text-slate-500" /></div>
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-lg text-slate-800">Ready for the Next Step?</h4>
                                        <p className="text-slate-500">Generate your personalized AI strategy, or book a free call to discuss your automation potential.</p>
                                    </div>
                                    <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 mt-4 md:mt-0 w-full sm:w-auto">
                                        <button onClick={handleGenerateInsights} disabled={isLoading} className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                            <SparkleIcon className="text-white" /> Generate AI Insights
                                        </button>
                                        <button onClick={() => setView('booking')} className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-slate-800/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                            <CalendarIcon className="text-white" /> Book a Free Consultation
                                        </button>
                                    </div>
                                </div>
                            )}
                            {isLoading && <InsightSkeleton />}
                            {error && <div className="text-center text-red-600 p-4"><p>{error}</p><button onClick={handleGenerateInsights} className="mt-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-md transition-all">Try Again</button></div>}
                            {insights.length > 0 && !isLoading && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <div className="mb-8">
                                        <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg"><SparkleIcon className="text-emerald-500" />Your Personalized Automation Strategy:</h5>
                                        <div className="space-y-3">
                                            {insights.map((line, i) => (
                                                <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                                    <CheckCircleIcon className="flex-shrink-0 text-emerald-500 mt-1" />
                                                    <p className="flex-grow text-slate-700">{renderInsight(line)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-200 pt-6">
                                        <div className="flex flex-col md:flex-row items-center gap-6">
                                            <div className="flex-grow text-center md:text-left">
                                                <h4 className="font-bold text-lg text-slate-800">Ready to unlock these results?</h4>
                                                <p className="text-slate-500">Schedule a free, no-obligation consultation to get a detailed automation roadmap for your business.</p>
                                            </div>
                                            <div className="flex-shrink-0 w-full md:w-auto">
                                                <button onClick={() => setView('booking')} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                                    <CalendarIcon className="text-white" /> Book a Free Consultation
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="booking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 text-center sm:text-left">Schedule Your Consultation</h3>
                            <button onClick={() => setView('results')} className="flex items-center justify-center gap-2 w-full sm:w-auto text-slate-600 hover:text-slate-900 font-semibold py-2.5 px-5 rounded-full bg-slate-200 hover:bg-slate-300 transition-all">
                                <ArrowLeftIcon /> Back to Results
                            </button>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-slate-200 h-[650px] sm:h-[700px] bg-white">
                           {calendlyUrl ? (
                                <iframe src={calendlyUrl} width="100%" height="100%" frameBorder="0" title="Schedule a meeting" className="w-full h-full"></iframe>
                           ) : (
                                <div className="w-full h-full flex items-center justify-center text-red-500">Invalid booking URL provided.</div>
                           )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Step3;
