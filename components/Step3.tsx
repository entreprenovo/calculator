
import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Robot, Sparkle, Clock, CurrencyDollar, TrendUp, ChartBar, CalendarBlank, ArrowLeft } from 'phosphor-react';
import type { CalculationResults, FormData, ROICalculatorProps } from '../types.ts';
import AnimatedCounter from './ui/AnimatedCounter.tsx';
import { generateInsights } from '../services/geminiService.ts';

interface Step3Props {
  results: CalculationResults;
  formData: FormData;
  config: ROICalculatorProps['config'];
  motionProps: any;
}

const InsightSkeleton: React.FC = () => (
    <div className="mt-6 p-6 bg-slate-100 rounded-xl border border-brand-accent/30 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
          <Sparkle size={20} className="text-brand-accent"/>
          <div className="h-5 w-3/4 bg-slate-200 rounded"></div>
      </div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg">
            <div className="w-5 h-5 rounded-full bg-slate-200 flex-shrink-0 mt-1"></div>
            <div className="h-4 bg-slate-200 rounded w-full flex-grow"></div>
          </div>
        ))}
      </div>
    </div>
);


const PIE_CHART_COLORS = ['#10B981', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#6366f1']; // emerald, blue, amber, red, purple, indigo
const BAR_CHART_COLORS = { manual: '#94a3b8', automated: '#10B981' }; // slate-400, emerald-500

const Step3: React.FC<Step3Props> = ({ results, formData, config, motionProps }) => {
  const [insights, setInsights] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState<'results' | 'booking'>('results');

  const handleGenerateInsights = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const generatedText = await generateInsights(formData);
      setInsights(generatedText);
    } catch (e) {
      setError('Failed to generate insights. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const calendlyUrl = useMemo(() => {
    try {
      const url = new URL(config.bookingUrl);
      const backgroundColor = 'f8fafc'; // bg-slate-50
      const primaryColor = '10B981';   // brand-accent (emerald)
      
      url.searchParams.append('hide_event_type_details', '1');
      url.searchParams.append('hide_gdpr_banner', '1');
      url.searchParams.append('background_color', backgroundColor);
      url.searchParams.append('text_color', '1e293b'); // slate-800
      url.searchParams.append('primary_color', primaryColor);
      
      return url.toString();
    } catch(e) {
      console.error("Invalid booking URL", e);
      return "";
    }
  }, [config.bookingUrl]);

  const costData = useMemo(() => [
    { name: 'Manual Work Cost', Cost: results.monthlyWastedCost, fill: BAR_CHART_COLORS.manual },
    { name: 'Cost After Automation', Cost: results.monthlyWastedCost - results.monthlySavings, fill: BAR_CHART_COLORS.automated },
  ], [results.monthlyWastedCost, results.monthlySavings]);

  const timeData = useMemo(() => [
    { name: 'Lead Gen', value: formData.leadGenHours },
    { name: 'Follow-ups', value: formData.followUpHours },
    { name: 'Data Entry', value: formData.dataEntryHours },
    { name: 'Scheduling', value: formData.schedulingHours },
    { name: 'Reporting', value: formData.reportingHours },
    { name: 'Email Mgmt', value: formData.emailHours },
  ].filter(d => d.value > 0), [formData]);
  
  const metricCards = [
    { id: 'moneySaved', value: results.monthlySavings, label: "Monthly Cost Savings", prefix: "$", icon: CurrencyDollar, highlight: true },
    { id: 'revenueBoost', value: results.monthlyRevenueBoost, label: "Add. Revenue Potential", prefix: "$", icon: TrendUp, highlight: true },
    { id: 'timeSaved', value: results.hoursAutomated, label: "Hours Automated/Month", suffix: " hrs", icon: Clock, highlight: false },
    { id: 'productivityGain', value: results.productivityGain, label: "Productivity Increase", suffix: "%", icon: ChartBar, highlight: false },
  ];
  
  const tooltipStyle = { 
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0', // slate-200
    borderRadius: '0.75rem',
    zIndex: 1000,
    color: '#1e293b', // slate-800
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  };
  const tooltipLabelStyle = { color: '#334155' }; // slate-700
  
  return (
    <motion.div {...motionProps}>
      <AnimatePresence mode="wait">
        {view === 'results' ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Your Automation ROI Potential</h3>
              <p className="text-slate-500">Here's how AI automation can transform your business.</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-10 text-center shadow-2xl shadow-emerald-500/10 mb-8 relative overflow-hidden">
              <div className="absolute -inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_60%)]"></div>
              <div className="relative">
                  <h4 className="text-lg font-medium text-emerald-600 mb-2 tracking-wide">Stunning First-Year Return</h4>
                  <div className="text-6xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-700 tracking-tighter">
                      <AnimatedCounter from={0} to={results.roi === Infinity ? 10000 : results.roi} />%
                  </div>
                  <p className="mt-2 text-slate-600 max-w-md mx-auto">Based on your inputs, this is your potential ROI after implementing our AI solutions.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {metricCards.map(metric => {
                const Icon = metric.icon;
                return (
                  <div key={metric.id} className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-300">
                    <Icon weight="bold" className={`mx-auto h-7 w-7 mb-2 ${metric.highlight ? 'text-brand-success' : 'text-brand-accent'}`} />
                    <div className="text-2xl md:text-3xl font-bold text-slate-800">
                      <AnimatedCounter from={0} to={metric.value} prefix={metric.prefix} suffix={metric.suffix} />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{metric.label}</div>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-4 text-center">Monthly Cost: Manual vs. Automated</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={costData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} interval={0} tick={{ dy: 10 }} />
                    <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `$${(value as number / 1000)}k`}/>
                    <Tooltip cursor={{fill: 'rgba(226, 232, 240, 0.5)'}} contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value as number)} />
                    <Bar dataKey="Cost" radius={[4, 4, 0, 0]}>
                      {costData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200 relative">
                 <h4 className="font-bold text-slate-700 mb-4 text-center">Weekly Hours Spent on Manual Tasks</h4>
                 <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={timeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                        return (percent as number) > 0.05 ? <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="black">{`${(percent * 100).toFixed(0)}%`}</text> : null;
                      }}>
                        {timeData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} stroke="none" />)}
                      </Pie>
                      <Tooltip cursor={{fill: 'rgba(226, 232, 240, 0.5)'}} contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} formatter={(value, name) => [`${value} hrs/week`, name]} />
                      <Legend iconSize={10} wrapperStyle={{fontSize: '12px', color: '#64748b'}}/>
                    </PieChart>
                 </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                          <p className="text-2xl font-bold text-slate-800">{timeData.reduce((acc, item) => acc + item.value, 0)}</p>
                          <p className="text-xs text-slate-500">Total hrs/week</p>
                      </div>
                  </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              {!insights && !isLoading && !error && (
                  <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="flex-shrink-0">
                       <Robot size={40} className="text-slate-500"/>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-lg text-slate-800">Ready for the Next Step?</h4>
                      <p className="text-slate-500">Generate your personalized AI strategy, or book a free call to discuss your automation potential.</p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
                       <button onClick={handleGenerateInsights} disabled={isLoading} className="w-full sm:w-auto bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-brand-accent/20 hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                          <Sparkle size={20} weight="bold" />
                          Generate AI Insights
                       </button>
                       <button onClick={() => setView('booking')} className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-slate-800/20 hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                          <CalendarBlank size={20} weight="bold" />
                          Book a Free Consultation
                       </button>
                    </div>
                  </div>
              )}

              {isLoading && <InsightSkeleton />}
              
              {error && 
                  <div className="text-center text-red-600 p-4">
                      <p>{error}</p>
                      <button onClick={handleGenerateInsights} className="mt-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-md transition-all">
                          Try Again
                      </button>
                  </div>
              }

              {!isLoading && insights && (
                  <>
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                      >
                        <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg"><Sparkle size={20} weight="bold" className="text-brand-accent"/>Your Personalized Automation Strategy:</h5>
                        <div className="text-slate-700 leading-relaxed space-y-3" dangerouslySetInnerHTML={{ __html: insights }} />
                      </motion.div>
                      <div className="border-t border-slate-200 pt-6">
                          <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-grow text-center md:text-left">
                              <h4 className="font-bold text-lg text-slate-800">Ready to unlock these results?</h4>
                              <p className="text-slate-500">Schedule a free, no-obligation consultation to get a detailed automation roadmap for your business.</p>
                            </div>
                            <div className="flex-shrink-0 w-full md:w-auto">
                               <button onClick={() => setView('booking')} className="w-full bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-brand-accent/20 hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                                  <CalendarBlank size={20} weight="bold" />
                                  Book a Free Consultation
                               </button>
                            </div>
                          </div>
                      </div>
                  </>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="booking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 text-center sm:text-left">Schedule Your Consultation</h3>
              <button 
                onClick={() => setView('results')}
                className="flex items-center justify-center gap-2 w-full sm:w-auto text-slate-600 hover:text-slate-900 font-semibold py-2.5 px-5 rounded-full bg-slate-200 hover:bg-slate-300 transition-all"
                aria-label="Back to results"
              >
                <ArrowLeft size={20} weight="bold" />
                Back to Results
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200 h-[650px] sm:h-[700px] bg-white">
              <iframe
                src={calendlyUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                title="Schedule a meeting"
                className="w-full h-full"
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Step3;