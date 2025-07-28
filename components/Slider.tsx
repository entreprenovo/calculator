
import React from 'react';
import { SliderProps } from '../types';

const Slider: React.FC<SliderProps> = ({
    id,
    label,
    value,
    min,
    max,
    step = 1,
    unit = "",
    onChange,
}) => {
    const percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;
    
    const sliderStyle: React.CSSProperties = {
        background: `linear-gradient(to right, #10B981 ${percentage}%, #e2e8f0 ${percentage}%)`,
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <label htmlFor={id.toString()} className="text-sm font-medium text-slate-600">
                    {label}
                </label>
                <span className="text-sm font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-700">
                    {unit}{value.toLocaleString()}
                </span>
            </div>
            <input
                type="range"
                id={id.toString()}
                name={id.toString()}
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                style={sliderStyle}
                className="w-full h-2.5 bg-slate-200 rounded-full appearance-none cursor-pointer slider-track"
            />
        </div>
    );
};

export default Slider;
