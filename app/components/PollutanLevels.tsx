import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getPollutantLabel,
  getPollutantUnit,
  getPollutantSeverity,
} from "@/lib/utils";
import type { AirQualityData } from "@/lib/types";

interface PollutantLevelsProps {
  data: AirQualityData;
}

export default function PollutantLevels({ data }: PollutantLevelsProps) {
  const pollutants = [
    { id: "co", value: data.components.co },
    { id: "no2", value: data.components.no2 },
    { id: "o3", value: data.components.o3 },
    { id: "pm2_5", value: data.components.pm2_5 },
    { id: "pm10", value: data.components.pm10 },
    { id: "so2", value: data.components.so2 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pollutant Levels</CardTitle>
        <CardDescription>Concentration of major air pollutants</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pollutants.map((pollutant) => {
            const severity = getPollutantSeverity(
              pollutant.id,
              pollutant.value
            );

            return (
              <div key={pollutant.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {getPollutantLabel(pollutant.id)}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityClass(severity)}`}
                  >
                    {pollutant.value.toFixed(2)}{" "}
                    {getPollutantUnit(pollutant.id)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getSeverityBarClass(severity)}`}
                    style={{ width: `${Math.min(severity * 25, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-sm text-muted-foreground">
          <p>
            <strong>PM2.5 & PM10:</strong> Fine particulate matter
          </p>
          <p>
            <strong>O3:</strong> Ozone at ground level
          </p>
          <p>
            <strong>NO2:</strong> Nitrogen dioxide
          </p>
          <p>
            <strong>SO2:</strong> Sulfur dioxide
          </p>
          <p>
            <strong>CO:</strong> Carbon monoxide
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function getSeverityClass(severity: number): string {
  switch (severity) {
    case 1:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    case 2:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
    case 3:
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
    case 4:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  }
}

function getSeverityBarClass(severity: number): string {
  switch (severity) {
    case 1:
      return "bg-green-500";
    case 2:
      return "bg-yellow-500";
    case 3:
      return "bg-orange-500";
    case 4:
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}
