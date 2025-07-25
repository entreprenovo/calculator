
import React from 'react';
import { motion } from 'framer-motion';
import type { StepProps } from '../types.ts';
import { INDUSTRY_OPTIONS } from '../constants.ts';
import Slider from './ui/Slider.tsx';

const Step1: React.FC<StepProps> = ({ data, updateData, motionProps }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    updateData(id as keyof typeof data, parseFloat(value));
  };
  
  return (
    <motion.div {...motionProps} className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-900">Tell us about your business</h3>
        <p className="text-slate-500">This helps us tailor the calculation to your specific situation.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <label htmlFor="industry" className="block text-sm font-medium text-slate-600 mb-2">Industry</label>
          <select
            id="industry"
            value={data.industry}
            onChange={handleInputChange}
            className="w-full bg-slate-100 border border-slate-300 rounded-md py-2.5 px-3 text-slate-900 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition"
          >
            {INDUSTRY_OPTIONS.map(opt => (
              <option key={opt.label} value={opt.value} className="bg-white">{opt.label}</option>
            ))}
          </select>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <Slider
              id="revenue"
              label="Monthly Revenue"
              value={data.revenue}
              min={0}
              max={250000}
              step={250}
              unit="$"
              onChange={handleInputChange}
            />
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
           <Slider
              id="teamSize"
              label="Team Size"
              value={data.teamSize}
              min={1}
              max={100}
              onChange={handleInputChange}
           />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <Slider
              id="hourlyCost"
              label="Average Hourly Cost"
              value={data.hourlyCost}
              min={10}
              max={250}
              unit="$"
              onChange={handleInputChange}
            />
        </div>
      </div>
    </motion.div>
  );
};

export default Step1;