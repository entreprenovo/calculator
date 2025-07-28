
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RoiBarChartProps {
    data: { name: string; Cost: number; fill: string }[];
}

const RoiBarChart: React.FC<RoiBarChartProps> = ({ data }) => {
    const formatYAxis = (tickItem: number) => {
        return `$${(tickItem / 1000).toLocaleString()}k`;
    };

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis tickFormatter={formatYAxis} tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
                    contentStyle={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value: number) => [new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value), 'Cost']}
                />
                <Legend wrapperStyle={{ fontSize: '14px', color: '#334155' }} />
                <Bar dataKey="Cost" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default RoiBarChart;
