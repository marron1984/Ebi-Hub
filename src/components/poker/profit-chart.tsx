"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { Session } from "@/types/poker";

interface ProfitChartProps {
  sessions: Session[];
}

export function ProfitChart({ sessions }: ProfitChartProps) {
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let cumulative = 0;
  const data = sortedSessions.map((session) => {
    cumulative += session.profit;
    return {
      date: new Date(session.date).toLocaleDateString("ja-JP", {
        month: "short",
        day: "numeric",
      }),
      profit: session.profit,
      cumulative,
      location: session.location,
    };
  });

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
          <XAxis
            dataKey="date"
            stroke="rgba(148,163,184,0.5)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="rgba(148,163,184,0.5)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(30,41,59,0.95)",
              border: "1px solid rgba(148,163,184,0.2)",
              borderRadius: "8px",
              color: "#F8FAFC",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#94A3B8" }}
            formatter={(value) => [`$${Number(value).toLocaleString()}`]}
          />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="#10B981"
            strokeWidth={2}
            fill="url(#profitGradient)"
            dot={{ r: 4, fill: "#10B981", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#10B981", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
