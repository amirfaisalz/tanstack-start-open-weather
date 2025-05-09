import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getPosition() {
    return new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

export function getAqiLabel(aqi: number): string {
    switch (aqi) {
        case 1:
            return "Good"
        case 2:
            return "Fair"
        case 3:
            return "Moderate"
        case 4:
            return "Poor"
        case 5:
            return "Very Poor"
        default:
            return "Unknown"
    }
}

export function getAqiColor(aqi: number): string {
    switch (aqi) {
        case 1:
            return "#4ade80" // Green
        case 2:
            return "#facc15" // Yellow
        case 3:
            return "#fb923c" // Orange
        case 4:
            return "#ef4444" // Red
        case 5:
            return "#7f1d1d" // Dark Red
        default:
            return "#6b7280" // Gray
    }
}

export function getPollutantLabel(id: string): string {
    switch (id) {
        case "co":
            return "CO"
        case "no":
            return "NO"
        case "no2":
            return "NO₂"
        case "o3":
            return "O₃"
        case "so2":
            return "SO₂"
        case "pm2_5":
            return "PM2.5"
        case "pm10":
            return "PM10"
        case "nh3":
            return "NH₃"
        default:
            return id
    }
}

export function getPollutantUnit(id: string): string {
    switch (id) {
        case "co":
        case "no":
        case "no2":
        case "o3":
        case "so2":
        case "nh3":
            return "μg/m³"
        case "pm2_5":
        case "pm10":
            return "μg/m³"
        default:
            return ""
    }
}

export function getPollutantSeverity(id: string, value: number): number {
    // These thresholds are simplified and should be adjusted based on actual air quality standards
    switch (id) {
        case "co":
            if (value < 4400) return 1
            if (value < 9400) return 2
            if (value < 12400) return 3
            return 4
        case "no2":
            if (value < 40) return 1
            if (value < 70) return 2
            if (value < 150) return 3
            return 4
        case "o3":
            if (value < 60) return 1
            if (value < 100) return 2
            if (value < 140) return 3
            return 4
        case "pm2_5":
            if (value < 10) return 1
            if (value < 25) return 2
            if (value < 50) return 3
            return 4
        case "pm10":
            if (value < 20) return 1
            if (value < 50) return 2
            if (value < 100) return 3
            return 4
        case "so2":
            if (value < 20) return 1
            if (value < 80) return 2
            if (value < 250) return 3
            return 4
        default:
            return 1
    }
}