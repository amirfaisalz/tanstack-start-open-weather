import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ForecastData } from "@/lib/types";

interface HistoricalChartProps {
  data: ForecastData[];
  type: "hourly" | "daily";
}

export default function HistoricalChart({ data, type }: HistoricalChartProps) {
  // If no data is provided, generate mock data
  const chartData = data.length > 0 ? data : generateMockData(type);

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return type === "hourly"
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString([], { weekday: "short" });
  };

  return (
    <ChartContainer
      config={{
        aqi: {
          label: "Air Quality Index",
          color: "hsl(var(--chart-1))",
        },
        pm25: {
          label: "PM2.5",
          color: "hsl(var(--chart-2))",
        },
        pm10: {
          label: "PM10",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dt" tickFormatter={formatXAxis} minTickGap={30} />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="aqi"
            stroke="var(--color-aqi)"
            name="AQI"
            dot={{ r: 3 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="pm25"
            stroke="var(--color-pm25)"
            name="PM2.5"
            dot={{ r: 3 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="pm10"
            stroke="var(--color-pm10)"
            name="PM10"
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function generateMockData(type: "hourly" | "daily"): ForecastData[] {
  const now = Math.floor(Date.now() / 1000);
  const interval = type === "hourly" ? 3600 : 86400; // 1 hour or 1 day in seconds
  const count = type === "hourly" ? 24 : 7; // 24 hours or 7 days

  return Array.from({ length: count }).map((_, i) => {
    const time = now + i * interval;
    // Generate some random but realistic-looking data
    const aqi = Math.floor(Math.random() * 3) + 1; // AQI between 1-3
    const pm25 = Math.random() * 20 + 5; // PM2.5 between 5-25
    const pm10 = Math.random() * 30 + 10; // PM10 between 10-40

    return {
      dt: time,
      main: { aqi },
      components: {
        co: Math.random() * 500 + 200,
        no: Math.random() * 5 + 1,
        no2: Math.random() * 20 + 5,
        o3: Math.random() * 60 + 20,
        so2: Math.random() * 10 + 2,
        pm2_5: pm25,
        pm10: pm10,
        nh3: Math.random() * 5 + 1,
      },
    };
  });
}
