import { Suspense, useState } from "react";
import { AlertTriangle, MapPin } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import {
  fetchAirQualityData,
  fetchLocationByCoords,
  fetchLocationByName,
} from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPosition } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MapComponent from "@/components/MapComponent";
import LocationSearch from "@/components/LocationSearch";
import AirQualityIndex from "@/components/AirQualityIndex";
import PollutantLevels from "@/components/PollutanLevels";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const getAirQualityOptions = (location?: string) =>
  queryOptions({
    queryKey: ["airQuality", location ?? "geo"],
    queryFn: async () => {
      let latitude: number;
      let longitude: number;
      let locationData;

      if (!location) {
        if (!navigator.geolocation) {
          throw new Error("Geolocation is not supported");
        }

        const position = await getPosition();
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        locationData = await fetchLocationByCoords({
          data: { lat: latitude, lon: longitude },
        });
      } else {
        locationData = await fetchLocationByName({ data: { query: location } });
        latitude = locationData.lat;
        longitude = locationData.lon;
      }

      const aqData = await fetchAirQualityData({
        data: { lat: latitude, lon: longitude },
      });

      return { locationData, aqData };
    },
    enabled: location !== "" || !!navigator.geolocation,
  });

export const Route = createFileRoute("/")({
  component: () => (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 ">
          <div className="container mx-auto py-6 px-4 md:px-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-24 w-full">
              <div className="flex-1">
                <Skeleton className="h-8 bg-green-200 mb-4" />
                <Skeleton className="h-8 bg-green-200" />
              </div>

              <Skeleton className="h-8 w-96 bg-green-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[30rem]">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border-green-300">
                  <CardHeader>
                    <Skeleton className="h-8 w-3/4 bg-green-200" />
                    <Skeleton className="h-4 w-1/2 bg-green-200" />
                    <Skeleton className="h-4 w-1/2 bg-green-200" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-80 w-full bg-green-200" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      }
    >
      <Home />
    </Suspense>
  ),
});

function Home() {
  const [location, setLocation] = useState("Bandar Lampung");

  const onSearch = (newLocation: string) => {
    setLocation(newLocation);
  };

  // data by user locations
  const { data, error, refetch } = useSuspenseQuery(
    getAirQualityOptions(location)
  );
  const { aqData, locationData } = data;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 ">
      <div className="container mx-auto py-6 px-4 md:px-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold tracking-tight">
                Urban Air Quality Dashboard{" "}
              </h1>
              <div className="flex items-center gap-2 text-lg font-medium">
                <MapPin className="h-5 w-5" />
                <span>
                  {locationData.name}, {locationData.country}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground">
              Monitor real-time air quality data for urban areas
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <LocationSearch onSearch={onSearch} />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {location && aqData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AirQualityIndex data={aqData} />
              <PollutantLevels data={aqData} />
              <Card className="pb-0">
                <CardHeader>
                  <CardTitle>Air Quality Map</CardTitle>
                  <CardDescription>
                    Visual representation of air quality in the area
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 overflow-hidden h-full">
                  {location && (
                    <MapComponent
                      location={{
                        lat: locationData.lat,
                        lon: locationData.lon,
                      }}
                      data={aqData}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <MapPin className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-medium">No Location Selected</h3>
              <p className="text-muted-foreground">
                Please allow location access or search for a city to view air
                quality data
              </p>
              <Button onClick={() => refetch()}>Detect My Location</Button>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
