import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { themes } from '../../utils/theme';

const SeekChart = ({ data, color, algorithm, graphMode, currentStep, theme }) => {
  const displayData = graphMode === 'stepByStep' 
    ? data.slice(0, currentStep + 1)
    : data;
    
  const chartData = displayData.map((track, index) => ({
    step: index,
    track: track
  }));

  const styles = themes[theme];
  
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={styles.chart.grid} />
        <XAxis 
          dataKey="step" 
          stroke={styles.chart.text}
          label={{ value: 'Request Sequence', position: 'insideBottom', offset: -10, fill: styles.chart.text }}
        />
        <YAxis 
          stroke={styles.chart.text}
          label={{ value: 'Track Number', angle: -90, position: 'insideLeft', fill: styles.chart.text }}
        />
        <RechartsTooltip 
          contentStyle={{ backgroundColor: styles.chart.tooltipBg, border: `1px solid ${styles.chart.tooltipBorder}`, borderRadius: '8px' }}
          labelStyle={{ color: styles.chart.text }}
          itemStyle={{ color: styles.chart.tooltipText }}
        />
        <Line 
          type="monotone" 
          dataKey="track" 
          stroke={color} 
          strokeWidth={3}
          dot={{ fill: color, r: 5 }}
          activeDot={{ r: 7 }}
          isAnimationActive={true}
          animationDuration={300}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SeekChart;