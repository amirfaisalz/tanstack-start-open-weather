import { AirQualityData, LocationData } from "./types";
import { createServerFn } from "@tanstack/react-start";

const API_KEY = process.env.OPEN_WEATHER_API_KEY

export const fetchLocationByName = createServerFn({ method: "GET" })
    .validator((d: { query: string }) => d)
    .handler(async (ctx): Promise<LocationData> => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(ctx.data.query)}&limit=1&appid=${API_KEY}`,
            )

            if (!response.ok) {
                throw new Error("Failed to fetch location data")
            }

            const data = await response.json()

            if (!data || data.length === 0) {
                throw new Error("Location not found")
            }

            return {
                name: data[0].name,
                country: data[0].country,
                state: data[0].state,
                lat: data[0].lat,
                lon: data[0].lon,
            }
        } catch (error) {
            console.error("Error fetching location by name:", error)
            throw error
        }
    });

export const fetchAirQualityData = createServerFn({ method: "GET" })
    .validator((d: { lat: number, lon: number }) => d)
    .handler(async (ctx): Promise<AirQualityData> => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/air_pollution?lat=${ctx.data.lat}&lon=${ctx.data.lon}&appid=${API_KEY}`,
            )

            if (!response.ok) {
                throw new Error("Failed to fetch air quality data")
            }

            const data = await response.json()

            return {
                ...data.list[0],
                dt: data.list[0].dt,
            }
        } catch (error) {
            console.error("Error fetching air quality data:", error)
            throw error
        }
    });

export const fetchLocationByCoords = createServerFn({ method: "GET" })
    .validator((d: { lat: number, lon: number }) => d)
    .handler(async (ctx): Promise<LocationData> => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/reverse?lat=${ctx.data.lat}&lon=${ctx.data.lon}&limit=1&appid=${API_KEY}`,
            )

            if (!response.ok) {
                throw new Error("Failed to fetch location data")
            }

            const data = await response.json()

            if (!data || data.length === 0) {
                throw new Error("Location not found")
            }

            return {
                name: data[0].name,
                country: data[0].country,
                state: data[0].state,
                lat: data[0].lat,
                lon: data[0].lon,
            }
        } catch (error) {
            console.error("Error fetching location by coordinates:", error)
            throw error
        }
    });
