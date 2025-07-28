
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PIE_CHART_COLORS } from '../constants';

interface RoiPieChartProps {
    data: { name: string; value: number }[];
}

const RoiPieChart: React.FC<RoiPieChartProps> = ({ data }) => {
    const total = data.reduce((acc, d) => acc + d.value, 0);

    if (total === 0) {
        return (
            <div className="w-full h-[250px] flex items-center justify-center text-slate-500">
                No time entries to display.
            </div>
        );
    }
    
    return (
        <div className="w-full h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="80%"
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => [`${value} hrs/week`, 'Time']}
                    />
                    <Legend
                        iconSize={10}
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{ fontSize: '12px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <p className="text-3xl font-bold text-slate-800">
                        {total}
                    </p>
                    <p className="text-xs text-slate-500">Total hrs/week</p>
                </div>
            </div>
        </div>
    );
};

export default RoiPieChart;
