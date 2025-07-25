
import React from 'react';
import type { SliderProps } from '../../types.ts';

const Slider: React.FC<SliderProps> = ({ id, label, value, min, max, step = 1, unit = '', onChange }) => {
  const percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;
  
  const sliderStyle: React.CSSProperties = {
    background: `linear-gradient(to right, #10B981 ${percentage}%, #e2e8f0 ${percentage}%)`, // brand-accent (emerald-500), slate-200
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="text-sm font-medium text-slate-600">{label}</label>
        <span className={`text-sm font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-700`}>
          {unit}{value.toLocaleString()}
        </span>
      </div>
      <input
        type="range"
        id={id}
        name={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        style={sliderStyle}
        className="w-full h-2.5 rounded-lg appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-6
                   [&::-webkit-slider-thumb]:h-6
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-white
                   [&::-webkit-slider-thumb]:shadow-md
                   [&::-webkit-slider-thumb]:ring-2
                   [&::-webkit-slider-thumb]:ring-offset-0
                   [&::-webkit-slider-thumb]:ring-emerald-500/50
                   [&::-moz-range-thumb]:appearance-none
                   [&::-moz-range-thumb]:w-6
                   [&::-moz-range-thumb]:h-6
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-white
                   [&::-moz-range-thumb]:shadow-md
                   [&::-moz-range-thumb]:border-2
                   [&::-moz-range-thumb]:border-emerald-500/50"
      />
    </div>
  );
};

export default Slider;