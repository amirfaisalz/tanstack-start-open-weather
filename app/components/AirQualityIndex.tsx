import type React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AirQualityData } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { getAqiLabel, getAqiColor } from "@/lib/utils";

interface AirQualityIndexProps {
  data: AirQualityData;
}

export default function AirQualityIndex({ data }: AirQualityIndexProps) {
  const aqi = data.main.aqi;
  const aqiLabel = getAqiLabel(aqi);
  const aqiColor = getAqiColor(aqi);
  const progressValue = (aqi / 5) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Air Quality Index</CardTitle>
        <CardDescription>Current air quality status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="text-5xl font-bold" style={{ color: aqiColor }}>
            {aqi}
          </div>
          <div
            className="text-xl font-medium px-3 py-1 rounded-full"
            style={{ backgroundColor: aqiColor, color: "#fff" }}
          >
            {aqiLabel}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Good</span>
            <span>Hazardous</span>
          </div>
          <Progress
            value={progressValue}
            className="h-3"
            style={
              {
                "--progress-background":
                  "linear-gradient(to right, #4ade80, #facc15, #f87171, #ef4444, #7f1d1d)",
              } as React.CSSProperties
            }
          />
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Last updated: {new Date(data.dt * 1000).toLocaleString()}</p>
          <p className="mt-2">{getAqiDescription(aqi)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function getAqiDescription(aqi: number): string {
  switch (aqi) {
    case 1:
      return "Air quality is considered satisfactory, and air pollution poses little or no risk.";
    case 2:
      return "Air quality is acceptable; however, some pollutants may be a concern for a very small number of people.";
    case 3:
      return "Members of sensitive groups may experience health effects. The general public is not likely to be affected.";
    case 4:
      return "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.";
    case 5:
      return "Health warnings of emergency conditions. The entire population is more likely to be affected.";
    default:
      return "Air quality information unavailable.";
  }
}
